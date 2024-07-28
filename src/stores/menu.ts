import { defineStore, acceptHMRUpdate } from "pinia";
import { computed, DefineComponent, markRaw, ref } from "vue";
import { SidebarItem } from "../components/Sidebar/types";
import Characters from "../components/Characters/index.vue";
import Encouter from "../components/Encounter/index.vue";
import History from "../components/History/index.vue";
import Session from "../components/Session/index.vue";
import Settings from "../components/Settings/index.vue";
import States from "../components/States/index.vue";
import { useConfigStore } from "./config";

export interface MenuItem extends SidebarItem {
    component?: DefineComponent<{}, {}, any>;
}

export const useMenuStore = defineStore("menu", () => {
    const configStore = useConfigStore();
    const { getkey } = configStore;

    const menu_items = computed(() => {
        return [
            {
                name: "Session",
                icon: "pi-clock",
                component: markRaw(Session),
                hotkey: getkey("menu_session"),
                tooltip: /* html */ `This is where sessions are initialized. Almost all things here requires a current session that is running.`,
            },
            {
                name: "Encounter",
                icon: "pi-bell",
                component: markRaw(Encouter),
                hotkey: getkey("menu_encounter"),
                tooltip: /* html */ `Start and monitor encounters. Triggers, States, and Effects are mostly utilizing this menu.`,
            },
            {
                name: "Character",
                icon: "pi-users",
                component: markRaw(Characters),
                hotkey: getkey("menu_characters"),
                tooltip: /* html */ `All characters are made in here. NPCs included.`,
            },
            {
                name: "States",
                icon: "pi-box",
                component: markRaw(States),
                hotkey: getkey("menu_states"),
                tooltip: /* html */ `Create states here`,
            },
            {
                name: "History",
                icon: "pi-history",
                component: markRaw(History),
                hotkey: getkey("menu_history"),
                tooltip: /* html */ `Where all pass sessions are documented. Useful for backtracking.`,
            },
            {
                name: "Search",
                icon: "pi pi-search",
                hotkey: getkey("global_search"),
                tooltip: /* html */ `Global search, find most things using this.`,
            },
            {
                name: "Settings",
                icon: "pi-cog",
                component: markRaw(Settings),
                last: true,
                tooltip: /* html */ `Modify Settings. <span class="text-amber-500">Warning: Clearing browser data clears all data</span>`,
            },
        ] satisfies MenuItem[];
    });

    const menu = ref<MenuItem>(menu_items.value[0]);

    return {
        menu,
        menus: menu_items,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot));
}
