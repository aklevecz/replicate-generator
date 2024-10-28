import storage from "$lib/storage";

const createHistoryStore = () => {
    let history = $state([]);
   
    return {
        get state() {
            return history;
        },
        init: () => {
            history = storage.getHistory();
        },
        add: (item) => {
            storage.updateHistory(item);
            history = [...history, item];
        },
        remove: (index) => {
            history = history.filter((_, i) => i !== index);
        },
        clear: () => {
            history = [];
        },
    };
}

export default createHistoryStore()