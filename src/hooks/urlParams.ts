import { set } from "@vueuse/core";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";

import { acceptHMRUpdate, defineStore, storeToRefs } from "pinia";

const useStore = defineStore("urlParams", () => {
    const keys = reactive<Record<string, any>>({});

    return { keys };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}

export const useUrlParams = <T = any>(key: string, initial: T) => {
    const store = useStore();
    const { keys } = storeToRefs(store);
    const urlparams = new URLSearchParams(window.location.search);

    if (!keys.value[key]) keys.value[key] = initial;
    const param = computed<T>({
        get: () => keys.value[key],
        set: (v) => (keys.value[key] = v),
    });

    watch(param, (v) => {
        urlparams.set(key, typeof v === "string" ? v : JSON.stringify(v));
        const newURL = `${window.location.pathname}?${urlparams.toString()}`;
        window.history.pushState({}, "", newURL);
    });

    onBeforeMount(() => {
        const urlvalue = urlparams.get(key);
        const value = urlvalue ? JSON.parse(urlvalue) : initial;
        set(param, value || initial);
    });

    return param;
};
