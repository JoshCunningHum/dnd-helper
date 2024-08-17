import { DefineComponent, markRaw } from "vue";
import Description from "./Description.vue";
import { Character } from "../../../../types/Characters";
import States from "./States.vue";
import History from "./History.vue";
import { TooltipValue } from "../../../../plugins/tooltip/types";
import { useConfigStore } from "../../../../stores/config";

export interface CharacterTab<Props extends Record<string, any>> {
    type: string;
    component: DefineComponent<Props, {}, any>;
    tooltip?: TooltipValue;
}

export const useCharacterTabs = () => {
    const { getkey } = useConfigStore();

    const tabs = [
        {
            type: "Description",
            component: markRaw(Description),
            tooltip: {
                text: "Double click description to edit",
                hotkey: getkey("characters.description"),
            },
        },
        {
            type: "States",
            component: markRaw(States),
            tooltip: {
                text: "All applied states to this character",
                hotkey: getkey("characters.states"),
            },
        },
        {
            type: "History",
            component: markRaw(History),
            tooltip: {
                text: "Saved Encounters, actions etc",
                hotkey: getkey("characters.history"),
            },
        },
    ] as const satisfies CharacterTab<{ character: Character }>[];

    return {
        tabs,
    };
};

export type TabList = ReturnType<typeof useCharacterTabs>["tabs"][number]["type"];
