import { DEFAULT_KEYS } from "./Hotkeys";

//#region UI
const DEFAULT_UI = {
    menu_char_splitter_left: 15,
    menu_state_splitter_left: 40,
};

//#region Overall Config
export interface Config {
    hotkeys: typeof DEFAULT_KEYS;
    ui: typeof DEFAULT_UI;
}

export const DEFAULT_CONFIG: Config = {
    hotkeys: DEFAULT_KEYS,
    ui: DEFAULT_UI,
};
