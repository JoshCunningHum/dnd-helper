import { StateType } from "./States";

export type Trigger = {
    name: string;
    type?: StateType[];
    options?: string[];
    satisfies: (variant: string) => boolean;
};

export type TriggerGroup = {
    name: string;
    options: (Trigger | TriggerGroup)[];
};
