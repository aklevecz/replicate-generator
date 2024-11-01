import configurations from "./configurations"
import configuration from "./configurations"
import { GenerationErrors } from "./stores/generate.svelte"

let endpoints = {
    generate: '/generate',
    auth: 'auth',
}

let api = () => {
    return {
        /**
         * Makes a POST request to the /generate endpoint with a prompt as
         * JSON. Returns the response as a Promise.
         *
         * @param {string} prompt The prompt to generate an image for.
         * @param {string} model The model to use for generation.
         * @return {Promise<ReplicateResponse>} The response from the server.
         */
        generate: async (prompt, model) => {
            let configuration = configurations[model]
            try {
                let res = await fetch(endpoints.generate, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: model,
                        // could also do this server side
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
        },

        /** AUTH */
        /** AUTH */
		/** @param {string} phoneNumber */
		sendCode: async (phoneNumber) => {
			const res = await fetch(`/${endpoints.auth}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ phoneNumber })
			});
			const data = await res.json();
			return data;
		},
		/** @param {string} code */
		verifyCode: async (code) => {
			const res = await fetch(`/${endpoints.auth}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ code })
			});
			const data = await res.json();
			return data;
		},
		logout: async () => {
			const res = await fetch(`/${endpoints.auth}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await res.json();
			return data;
		},
    }
}

export default api()