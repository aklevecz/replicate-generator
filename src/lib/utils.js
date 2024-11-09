/** @param {string} imageUrl */
export async function fetchImageAsBase64(imageUrl) {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the image data as a blob
    const blob = await response.blob();

    // Create a FileReader to convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        // reader.result contains the base64 string
        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(new Error("Failed to convert image to base64"));
      };

      // Start reading the blob as a data URL (base64)
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}

/**
 * Calculate SHA-256 hash of array buffer
 * @param {ArrayBuffer} buffer - The buffer to hash
 * @returns {Promise<string>} Hex string of hash
 */
export async function calculateHash(buffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
