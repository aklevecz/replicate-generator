import api from "$lib/api";
import modelStorage from "$lib/idb";
import storage from "$lib/storage";
import { fetchImageAsBase64 } from "$lib/utils";
import history from "./history.svelte";

export const GenerationErrors = {
  NETWORK: "Check your internet connection and try again",
  NO_RESPONSE: "No response from server",
  TIMEOUT: "Generation took too long",
  CANCELED: "Generation was canceled",
  FAILED: "Generation failed - please try again",
  INVALID_ID: "Invalid generation ID received",
};

/** @type {{generating: boolean, status: Status, outputs: any[], percentage: number, cachedImgs: GeneratedImgEntry[]}} */
const defaultState = { generating: false, status: "idle", outputs: [], percentage: 0, cachedImgs:[] };
const createGenerateStore = () => {
  let generate = $state({ ...defaultState });

  async function refreshAllGeneratedImgs() {
    const generatedImgs = await modelStorage.getAllGeneratedImgs();
    generate.cachedImgs = generatedImgs;
  }

  return {
    get state() {
      return generate;
    },
    init: async () => {
      refreshAllGeneratedImgs();
    },
    /**
     * Asynchronously generates data based on the provided prompt by making
     * a request to the API.
     *
     * @param {string} prompt - The text prompt used for generating data.
     * @param {string} model - The model used for generating data.
     * @returns {Promise<ReplicateResponse | undefined>} - A promise that resolves with the generated data.
     * @throws Will log an error if the request fails.
     */
    createGeneration: async (prompt, model) => {
      generate.generating = true;
      try {
        let data = await api.generate(prompt, model);
        return data;
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * Periodically polls the API to check on the status of a generation.
     * If the generation has finished, updates the state and clears the interval.
     * If the generation times out (defined by `maxTimeout`), clears the interval and
     * sets the state to "canceled".
     *
     * @param {string} id - The generation ID to poll.
     * @returns {Promise<number>} The ID of the interval that was set.
     */
    pollGeneration: async (id) => {
      /** @type {*} */
      let interval = null;
      let intervalMs = 1000;
      let maxTimeout = 60 * 1000 * 6;
      let intervalStart = Date.now();
      generate.generating = true;
      interval = setInterval(async () => {
        const data = await api.checkGeneration(id);
        const str = data.logs;
        const seed = str.match(/Using seed: (\d+)/)?.[1];
        const prompt = str.match(/Prompt: (.*?)(?=txt2img)/s)?.[1];
        const loadTime = str.match(/Loading LoRA took: ([\d.]+)/)?.[1];

        // Updated regex for progress updates
        const progressUpdates = [
          ...str.matchAll(/(\d+)%\|[█▌▎▍▋▊▉ ]+\| (\d+)\/(\d+) \[([^\]]+)\](?:, ([\d.]+)it\/s)?/g),
        ].map((match) => ({
          percentage: parseInt(match[1]),
          step: parseInt(match[2]),
          totalSteps: parseInt(match[3]),
          time: match[4],
          iterationsPerSecond: match[5] ? parseFloat(match[5]) : null,
        }));

        try {
          generate.percentage = progressUpdates[progressUpdates.length - 1].percentage;
        } catch (e) {}

        console.log({
          seed,
          prompt,
          loadTime,
          progressUpdates,
        });

        generate.status = data.status;
        if (data.status === "succeeded") {
          generate.generating = false;
          generate.outputs = data.output;
          history.add(data.output[0]);
          const imgUrl = data.output[0];
          // fetch image data and then store it in base64 string to be stored in browser storage
          // CODE HERE
          fetchImageAsBase64(imgUrl).then(async (base64) => {
            storage.saveLastGenerated(base64);
            await modelStorage.addGeneratedImg({ imgUrl, base64Url: base64, seed: seed || "", prompt: prompt || "" });
            await refreshAllGeneratedImgs();
          });
          clearInterval(interval);
        } else if (data.status === "failed") {
          generate.generating = false;
          clearInterval(interval);
        } else if (data.status === "canceled") {
          generate.generating = false;
          clearInterval(interval);
        }
        let timeElapsed = Date.now() - intervalStart;
        if (timeElapsed > maxTimeout) {
          generate.generating = false;
          clearInterval(interval);
        }
      }, intervalMs);
      return interval;
    },
    reset: () => {
      generate = { ...defaultState };
    },
  };
};

export default createGenerateStore();
