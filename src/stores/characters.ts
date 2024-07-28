import { get, set, useAsyncState } from "@vueuse/core";
import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import { Character } from "../types/Characters";

export const useCharactersStore = defineStore("characters", () => {
    const {
        state: characters,
        isLoading,
        execute: load,
    } = useAsyncState(Character.all, [], {
        immediate: true,
        shallow: false,
    });

    const selected = ref<Character>();

    const tags = computed(() =>
        Array.from(new Set(get(characters).flatMap((char) => char.tags))),
    );

    const add = async (...params: Parameters<typeof Character.add>) => {
        const c = await Character.add(...params);
        characters.value.push(c);
        return c;
    };

    const remove = async (c: Character) => {
        await c.delete();
        // remove the selected
        set(selected, undefined);
        const index = characters.value.findIndex((ch) => ch.id === c.id);
        if (index > -1) characters.value.splice(index, 1);
    };

    return {
        characters,
        selected,
        isLoading,
        tags,

        load,
        add,
        remove,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useCharactersStore, import.meta.hot),
    );
}
