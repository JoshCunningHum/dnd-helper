export type SidebarItem = {
    name: string;
    label?: string;
    icon?: string;
    click?: () => void;
    last?: boolean;
    hotkey?: string;
    tooltip?: string;
};
