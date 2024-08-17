import { set, whenever } from "@vueuse/core";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useAsyncStateTimeout } from "../hooks/AsyncStateTimeout";
import { State } from "../types/States";
import { useCharactersStore } from "./characters";
import { Character } from "../types/Characters";

export const useStatesStore = defineStore("states", () => {
    const characterStore = useCharactersStore();
    const {
        state: states,
        isLoading,
        execute: load,
    } = useAsyncStateTimeout(State.all, [], {
        shallow: false,
    });

    whenever(
        () => !characterStore.isLoading,
        () => load(characterStore.characters),
        { immediate: true },
    );

    const selected = ref<State>();

    const add = async (...params: Parameters<typeof State.add>) => {
        const s = await State.add(...params);
        states.value.push(s);
        return s;
    };

    const remove = async (s: State) => {
        await s.delete();
        set(selected, undefined);
        const index = states.value.findIndex((st) => st.id === s.id);
        if (index !== -1) states.value.splice(index, 1);
    };

    const getStatesFrom = (...c: (Character | string)[]) =>
        states.value.filter((state) => c.some((_) => state.isAttached(_)));

    return {
        states,
        selected,
        isLoading,

        load,
        add,
        remove,
        getStatesFrom,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStatesStore, import.meta.hot));
}
