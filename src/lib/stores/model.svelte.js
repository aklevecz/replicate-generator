import modelStorage from "$lib/idb"

/**
 * @typedef {Object} ModelStore
 * @property {Array<Omit<ModelEntry, "data">>} models
 */

function createModelStore() {
    /** @type {ModelStore} */
    let model = $state({models: []})

    function refreshAllModels() {
        modelStorage.getAllModels().then((models) => {
            model = {models}
        })
    }

    return {
        get state() {
            return model
        },
        async init() {
            refreshAllModels()
        },
        /** @param {string} id */
        async delete(id) {
            await modelStorage.deleteModel(id)
            refreshAllModels()
        },
        refreshAllModels
    }
}

export default createModelStore()