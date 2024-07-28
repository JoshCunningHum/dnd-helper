// This is where all the events happen

import { defineStore, acceptHMRUpdate } from "pinia";

export const useEventsStore = defineStore("events", () => {
    const listen = () => {};

    const emit = () => {};

    return {
        listen,
        emit,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useEventsStore, import.meta.hot));
}
