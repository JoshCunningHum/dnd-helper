import { useLocalStorage } from "@vueuse/core";
import { defineStore, acceptHMRUpdate } from "pinia";
import { DEFAULT_CONFIG } from "../types/Config";
import { computed, ref } from "vue";
import { DEFAULT_KEYS } from "../types/Hotkeys";

type NestedKeyOf<T> = T extends object
    ? {
          [K in keyof T]: K extends string
              ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
              : never;
      }[keyof T]
    : never;

type KeyPattern = NestedKeyOf<typeof DEFAULT_KEYS>;

export const useConfigStore = defineStore("config", () => {
    const config = import.meta.env.DEV
        ? ref(DEFAULT_CONFIG)
        : useLocalStorage("dnd-helper-config", DEFAULT_CONFIG, {
              deep: true,
              writeDefaults: true,
          });

    const hotkeys = computed(() => config.value.hotkeys);
    const ui = computed(() => config.value.ui);

    function getkey(key: KeyPattern): string {
        const parts = key.split(".");
        let result: any = DEFAULT_KEYS;

        for (const part of parts) {
            result = result[part];
            if (result === undefined) {
                throw new Error(`Invalid key: ${key}`);
            }
        }

        return result;
    }

    return {
        config,
        hotkeys,
        ui,
        getkey,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot));
}
