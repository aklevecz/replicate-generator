import { REPLICATE_API_TOKEN } from "$env/static/private";
import configurations from "$lib/configurations";
// import configuration from "$lib/configuration";
import { json } from "@sveltejs/kit";

const headers = {
    'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json',
  //   'Prefer': 'wait'
  };

/**
 * @param {string} prompt - The prompt for the prediction
 * @returns {Promise<ReplicateResponse>}
 */
// async function makeReplicateRequestPrivate(prompt) {
//     const url = 'https://api.replicate.com/v1/deployments/aklevecz/cog-flux-schnell-lora/predictions';
    
//     const body = JSON.stringify({
//       input: {
//         prompt: prompt,
//         hf_lora: configuration.model,
//       }
//     });
  
//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: headers,
//         body: body
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       const data = await response.json();
//       console.log(data);
//       return data;
//     } catch (error) {
//       console.error('There was a problem with the fetch operation:', error);
//       throw error;
//     }
//   }

  /**
   * @param {string} prompt - The prompt for the prediction
   * @param {import("$lib/configurations").Configuration} configuration - The configuration for the prediction
   * @returns {Promise<ReplicateResponse | undefined>} - The prediction result
   */
  const makeReplicateRequestPublic = async (prompt, configuration) => {
    const url = 'https://api.replicate.com/v1/predictions';
    const headers = {
      'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      version: configuration.replicateId,
      input: {
        prompt,
        ...configuration.modelParams
        // hf_lora: configuration.model
      }
    });
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };
  

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { prompt, model } = await request.json();
  const configuration = configurations[model];
  const data = await makeReplicateRequestPublic(prompt, configuration);
  return json(data);
}


export async function GET({url}) {
    const id = url.searchParams.get('id')
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {headers})
    const data = await res.json()
    return json(data)
}