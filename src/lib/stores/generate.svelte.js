import api from "$lib/api"

export const GenerationErrors = {
  NETWORK: 'Check your internet connection and try again',
  NO_RESPONSE: 'No response from server',
  TIMEOUT: 'Generation took too long',
  CANCELED: 'Generation was canceled',
  FAILED: 'Generation failed - please try again',
  INVALID_ID: 'Invalid generation ID received'
}

const createGenerateStore = () => {
    /** @type {{generating: boolean, status: Status, outputs: any[]}} */
    const generate = $state({generating: false, status: 'idle', outputs:[]})
    
    return {
        get state() {
            return generate
        },
        /**
         * Asynchronously generates data based on the provided prompt by making
         * a request to the API.
         *
         * @param {string} prompt - The text prompt used for generating data.
         * @returns {Promise<ReplicateResponse | undefined>} - A promise that resolves with the generated data.
         * @throws Will log an error if the request fails.
         */
        createGeneration: async (prompt) => {
            generate.generating = true
            try {
                let data = await api.generate(prompt)
                return data
            } catch (error) {
                console.error(error)
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
            const data = await api.checkGeneration(id)
            console.log(data);
            if (data.status === "succeeded") {
                generate.generating = false;
                generate.status = "succeeded";
                generate.outputs = data.output;
                clearInterval(interval);
            } else if (data.status === "failed") {
                generate.generating = false;
                generate.status = "failed";
                clearInterval(interval);
            } else if (data.status === "canceled") {
                generate.generating = false;
                generate.status = "canceled";
                clearInterval(interval);
            }
            let timeElapsed = Date.now() - intervalStart;
            if (timeElapsed > maxTimeout) {
                generate.generating = false;
                generate.status = "canceled";
                clearInterval(interval);
            }
            }, intervalMs);
            return interval
        }
    }
}

export default createGenerateStore()