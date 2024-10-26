import configuration from "./configuration"

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
         * @return {Promise<Response>} The response from the server.
         */
        generate: (prompt) => {
            return fetch(endpoints.generate, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt.toLocaleLowerCase().replaceAll(configuration.promptWord, configuration.triggerWord)
                })
            })
        }
    }
}

export default api()