import { REPLICATE_API_TOKEN } from "$env/static/private";
import { json } from "@sveltejs/kit";
// {
//     "id": "qknb76qzznrgm0cjkt9r98vtv0",
//     "model": "aklevecz/cog-flux-schnell-lora",
//     "version": "dp-7fa274ea152f4f75b83ecb3a0b1e5f6d",
//     "input": {
//         "prompt": "a white cat eating chickens"
//     },
//     "logs": "",
//     "output": null,
//     "data_removed": false,
//     "error": null,
//     "status": "starting",
//     "created_at": "2024-10-18T07:42:32.445Z",
//     "urls": {
//         "cancel": "https://api.replicate.com/v1/predictions/qknb76qzznrgm0cjkt9r98vtv0/cancel",
//         "get": "https://api.replicate.com/v1/predictions/qknb76qzznrgm0cjkt9r98vtv0"
//     }
// }

const headers = {
    'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json',
  //   'Prefer': 'wait'
  };

/**
 * @param {string} prompt - The prompt for the prediction
 * @returns {Promise<ReplicateResponse>}
 */
async function makeReplicateRequest(prompt) {
    const url = 'https://api.replicate.com/v1/deployments/aklevecz/cog-flux-schnell-lora/predictions';
    
    const body = JSON.stringify({
      input: {
        prompt: prompt,
        hf_lora: 'aklevecz/finn_flux',
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
      throw error;
    }
  }

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { prompt } = await request.json();
  const data = await makeReplicateRequest(prompt);
  return json(data);
}


export async function GET({url}) {
    const id = url.searchParams.get('id')
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {headers})
    const data = await res.json()
    console.log(data)
    return json(data)
}