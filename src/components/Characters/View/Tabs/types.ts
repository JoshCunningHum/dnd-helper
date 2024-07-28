import { DefineComponent, markRaw } from "vue";
import Description from "./Description.vue";
import { Character } from "../../../../types/Characters";
import States from "./States.vue";
import History from "./History.vue";
import { TooltipValue } from "../../../../plugins/tooltip/types";

export interface CharacterTab {
    type: string;
    component: DefineComponent<{ character: Character }, {}, any>;
    tooltip?: TooltipValue;
}

export const tabs = [
    {
        type: "Description",
        component: markRaw(Description),
        tooltip: {
            text: "Double click description to edit",
        },
    },
    {
        type: "States",
        component: markRaw(States),
    },
    {
        type: "History",
        component: markRaw(History),
    },
] as const satisfies CharacterTab[];

export type TabList = (typeof tabs)[number]["type"];
