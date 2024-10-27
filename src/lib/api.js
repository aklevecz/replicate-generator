import configuration from "./configuration"
import { GenerationErrors } from "./stores/generate.svelte"

let endpoints = {
    generate: '/generate'
}

let api = () => {
    return {
        /**
         * Makes a POST request to the /generate endpoint with a prompt as
         * JSON. Returns the response as a Promise.
         *
         * @param {string} prompt The prompt to generate an image for.
         * @return {Promise<ReplicateResponse>} The response from the server.
         */
        generate: async (prompt) => {
            try {
                let res = await fetch(endpoints.generate, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: prompt.toLocaleLowerCase().replaceAll(configuration.promptWord, configuration.triggerWord)
                    })
                })
                let data = await res.json()
                return data
            } catch (error) {
                console.error(error)
                throw new Error(GenerationErrors.NETWORK)
            }
        },
        /**
         * Makes a GET request to the /generate endpoint with a generation ID
         * as a query string parameter. Returns the response as a Promise.
         *
         * @param {string} id The ID of the generation to check.
         * @return {Promise<ReplicateResponse>} The response from the server.
         */
        checkGeneration: async (id) => {
            let res = await fetch(`/generate?id=${id}`);
            let data = await res.json()
            return data
        }
    }
}

export default api()