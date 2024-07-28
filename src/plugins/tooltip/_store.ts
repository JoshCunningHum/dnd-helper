import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";

export const use___tooltipstore___ = defineStore("___tooltipstore___", () => {
    const text = ref("");
    const active = ref(false);

    return {
        text,
        active,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(use___tooltipstore___, import.meta.hot),
    );
}
