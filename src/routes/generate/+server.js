import { REPLICATE_API_TOKEN } from "$env/static/private";
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
async function makeReplicateRequestPrivate(prompt) {
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

  const public_dev = "091495765fa5ef2725a175a57b276ec30dc9d39c22d30410f2ede68a3eab66b3"
  const public_schnell = "2a6b576af31790b470f0a8442e1e9791213fa13799cbb65a9fc1436e96389574"
  /**
   * @param {string} prompt - The prompt for the prediction
   * @returns {Promise<ReplicateResponse | undefined>} - The prediction result
   */
  const makeReplicateRequestPublic = async (prompt) => {
    const url = 'https://api.replicate.com/v1/predictions';
    const headers = {
      'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      version: public_schnell,
      input: {
        prompt,
        hf_lora: "aklevecz/finn_flux"
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
  const { prompt } = await request.json();
  const data = await makeReplicateRequestPublic(prompt);
  return json(data);
}


export async function GET({url}) {
    const id = url.searchParams.get('id')
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {headers})
    const data = await res.json()
    console.log(data)
    return json(data)
}