/** @typedef {('idle'|'starting'|'processing'|'succeeded'|'failed'|'canceled')} Status */

/**
 * @typedef {Object} ReplicateResponse
 * @property {string} id - Unique identifier for the prediction
 * @property {string} model - Name of the model used for the prediction
 * @property {string} version - Version of the model used
 * @property {Object} input - Input parameters for the prediction
 * @property {string} input.hf_lora - HuggingFace LoRA identifier
 * @property {string} input.prompt - Text prompt used for the prediction
 * @property {string} logs - Any logs generated during the prediction process
 * @property {string[]} output - Array of URLs to the generated output(s)
 * @property {boolean} data_removed - Indicates whether the data has been removed
 * @property {null|string} error - Error message if an error occurred, null otherwise
 * @property {Status} status - Current status of the prediction
 * @property {string} created_at - ISO 8601 timestamp of when the prediction was created
 * @property {Object} urls - URLs for additional actions
 * @property {string} urls.cancel - URL to cancel the prediction
 * @property {string} urls.get - URL to get the prediction details
 */

/**
 * @typedef {Object} ModelEntry
 * @property {string} id - Unique identifier for the model
 * @property {string} name - Original filename
 * @property {string} type - File type (e.g., 'fbx', 'obj', 'gltf')
 * @property {ArrayBuffer} data - The actual model file data
 * @property {string} hash - SHA-256 hash of the model file
 * @property {number} size - File size in bytes
 * @property {number} timestamp - When the model was saved
 * @property {string} [thumbnail] - Optional base64 thumbnail
 */

/**
 * @typedef {Object} GeneratedImgEntry
 * @property {string} id
 * @property {string} imgUrl
 * @property {string} base64Url
 * @property {string} seed
 * @property {string} prompt
 */