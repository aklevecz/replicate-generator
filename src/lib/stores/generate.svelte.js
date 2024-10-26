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
    const generate = $state({})
    
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
            try {
                let res = await api.generate(prompt)
                let data = await res.json()
                return data
            } catch (error) {
                console.error(error)
                throw new Error(GenerationErrors.NETWORK)
            }
        }
    }
}

export default createGenerateStore()