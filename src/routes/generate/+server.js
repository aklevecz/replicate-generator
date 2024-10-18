import { REPLICATE_API_TOKEN } from "$env/static/private";
import { json } from "@sveltejs/kit";

/**
 * @param {string} prompt - The prompt for the prediction
 * @returns {Promise<ReplicateResponse>}
 */
async function makeReplicateRequest(prompt) {
    const url = 'https://api.replicate.com/v1/deployments/aklevecz/cog-flux-schnell-lora/predictions';
    const headers = {
      'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    //   'Prefer': 'wait'
    };
    const body = JSON.stringify({
      input: {
        prompt: prompt
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
