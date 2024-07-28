import { DEFAULT_KEYS } from "./Hotkeys";

export interface Config {
    hotkeys: typeof DEFAULT_KEYS;
    ui: {
        menu_char_splitter_left: number;
    };
}

export const DEFAULT_CONFIG: Config = {
    hotkeys: DEFAULT_KEYS,
    ui: {
        menu_char_splitter_left: 15,
    },
};
