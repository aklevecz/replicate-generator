const storage = () => {
  const keys = {
    history: "history",
    lastGenerated: "last_generated"
  };
  /**
   * Get a value from the storage.
   * @param {string} key The key to get the value for.
   * @returns {*} The value associated with the key.
   */
  const get = (key) => {
    return localStorage.getItem(key);
  };

  /**
   * Set a value in the storage.
   * @param {string} key The key to set the value for.
   * @param {*} value The value to set.
   */
  const set = (key, value) => {
    localStorage.setItem(key, value);
  };

  const getHistory = () => {
    return JSON.parse(get(keys.history) || "[]");
  };
  return {
    getHistory,
    /**
     * Updates the history in the storage with the provided value.
     *
     * @param {string} value - The value to set as the new history.
     */
    updateHistory: (value) => {
      let currentHistory = getHistory();
      if (!currentHistory) {
        currentHistory = [];
      }
      currentHistory.push(value);
      set(keys.history, JSON.stringify(currentHistory));
    },
    /** @param {string} value */
    saveLastGenerated: (value) => {
      set(keys.lastGenerated, JSON.stringify(value))
    },
    getLastGenerated: () => {
      return JSON.parse(get(keys.lastGenerated) || "")
    }
  };
};

export default storage()
