import { calculateHash } from "./utils";

class ModelStorage {
  constructor() {
    /** @type {string} */
    this.dbName = "assetStorage";
    /** @type {number} */
    this.version = 1;
    /** @type {IDBDatabase | null} */
    this.db = null;

    this.stores = {
      models: "models",
      recentModels: "recentModels",
      generatedImgs: "generatedImgs",
    };
  }

  /**
   * Initialize the database connection
   * @returns {Promise<void>}
   */
  async init() {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onerror = () => {
        reject(new Error("Failed to open 3D model database"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        // @ts-ignore
        const db = /** @type {IDBDatabase} */ (event.target?.result);

        // Create models store with indexes
        if (!db.objectStoreNames.contains(this.stores.models)) {
          const modelStore = db.createObjectStore(this.stores.models, { keyPath: "id" });
          modelStore.createIndex("name", "name", { unique: false });
          modelStore.createIndex("type", "type", { unique: false });
          modelStore.createIndex("timestamp", "timestamp", { unique: false });
        }

        // Create recent models store
        if (!db.objectStoreNames.contains(this.stores.recentModels)) {
          db.createObjectStore(this.stores.recentModels, { keyPath: "id" });
        }

        // Create generated images store
        if (!db.objectStoreNames.contains(this.stores.generatedImgs)) {
          db.createObjectStore(this.stores.generatedImgs, { keyPath: "id" });
        }
      };
    });
  }

  /**
   * Save a 3D model file to the database
   * @param {File} file - The 3D model file
   * @returns {Promise<string>} The ID of the saved model
   */
  async saveModel(file) {
    // await this.init();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          let result = /** @type {ArrayBuffer} */ (reader.result);
          const fileHash = await calculateHash(result);
          // Check if file with same hash already exists
          const existingModels = await this.getAll(this.stores.models);
          const duplicate = existingModels.find((model) => model.hash === fileHash);
          if (duplicate) {
            // Return existing model ID if duplicate found
            console.error(`Duplicate model found: ${duplicate.id}`);
            resolve(duplicate.id);
            return;
          }
          const id = `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          /** @type {ModelEntry} */
          const modelEntry = {
            id,
            name: file.name,
            type: file.name.split(".").pop()?.toLowerCase() || "unknown",
            data: result,
            size: file.size,
            hash: fileHash,
            timestamp: Date.now(),
          };

          await this.set(this.stores.models, modelEntry);
          await this.updateRecentModels(id, modelEntry.name);
          resolve(id);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Error reading model file"));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Get a model by its ID
   * @param {string} id - The model ID
   * @returns {Promise<ModelEntry | null>}
   */
  async getModel(id) {
    return this.get(this.stores.models, id);
  }

  /**
   * Get all models (metadata only, no file data)
   * @returns {Promise<Array<Omit<ModelEntry, 'data'>>>}
   */
  async getAllModels() {
    // await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction(this.stores.models, "readonly");
      const store = transaction.objectStore(this.stores.models);
      const request = store.getAll();

      request.onerror = () => {
        reject(new Error("Error fetching models"));
      };

      request.onsuccess = () => {
        // Return all models but exclude the actual file data
        const models = request.result.map(({ data, ...metadata }) => metadata);
        resolve(models);
      };
    });
  }

  /**
   * Get recently accessed models
   * @param {number} limit - Maximum number of recent models to return
   * @returns {Promise<Array<{id: string, name: string, timestamp: number}>>}
   */
  async getRecentModels(limit = 5) {
    const result = await this.getAll(this.stores.recentModels);
    return result.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }

  /**
   * Update recent models list
   * @private
   * @param {string} id - Model ID
   * @param {string} name - Model name
   */
  async updateRecentModels(id, name) {
    const entry = {
      id,
      name,
      timestamp: Date.now(),
    };
    await this.set(this.stores.recentModels, entry);
  }

  /**
   * Delete a model by ID
   * @param {string} id - The model ID
   * @returns {Promise<void>}
   */
  async deleteModel(id) {
    // await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction([this.stores.models, this.stores.recentModels], "readwrite");
      const modelStore = transaction.objectStore(this.stores.models);
      const recentStore = transaction.objectStore(this.stores.recentModels);

      modelStore.delete(id);
      recentStore.delete(id);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(new Error("Error deleting model"));
      };
    });
  }
  /** @param {{imgUrl: string, base64Url: string, seed: string, prompt: string}} entry */
  async addGeneratedImg(entry) {
    await this.set(this.stores.generatedImgs, {...entry, id: `${entry.prompt.replace(/[^a-zA-Z0-9]/g, '_')}_${entry.seed}`});
  }

  /** @param {string} id */
  async getGeneratedImg(id) {
    return this.get(this.stores.generatedImgs, id);
  }

  async getAllGeneratedImgs() {
    // await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction(this.stores.generatedImgs, "readonly");
      const store = transaction.objectStore(this.stores.generatedImgs);
      const request = store.getAll();

      request.onerror = () => {
        reject(new Error("Error fetching models"));
      };

      request.onsuccess = () => {
        // Return all models but exclude the actual file data
        const models = request.result.map(({ base64Url, ...metadata }) => metadata);
        resolve(models);
      };
    });
  }

  /**
   * Generic method to get a value from a store
   * @private
   * @param {string} storeName
   * @param {string} key
   * @returns {Promise<any>}
   */
  async get(storeName, key) {
    // await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => {
        reject(new Error(`Error fetching from ${storeName}`));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  /**
   * Generic method to get all values from a store
   * @private
   * @param {string} storeName
   * @returns {Promise<Array<any>>}
   */
  async getAll(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => {
        reject(new Error(`Error fetching from ${storeName}`));
      };

      request.onsuccess = () => {
        resolve(request.result || []);
      };
    });
  }

  /**
   * Generic method to set a value in a store
   * @private
   * @param {string} storeName
   * @param {any} value
   * @returns {Promise<void>}
   */
  async set(storeName, value) {
    // await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      console.log(`Storing ${value} in ${storeName}`)
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      console.log(`Store is ${store}`)
      const request = store.put(value);

      request.onerror = () => {
        reject(new Error(`Error storing in ${storeName}`));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  /**
   * Close the database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Create and export a singleton instance
const modelStorage = new ModelStorage();
export default modelStorage;
