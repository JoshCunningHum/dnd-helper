<script setup lang="ts">
import { computed } from "vue";
import { TooltipValue } from "../../plugins/tooltip/types";
import Hotkey from "../Hotkey.vue";
import { SidebarItem } from "./types";

const props = defineProps<{
    item: string | number | SidebarItem;
}>();

const label = computed(() => {
    const { item } = props;
    if (typeof item === "string") return item;
    if (typeof item === "number") return item.toString();
    return item.label || item.name;
});

const tooltip = computed(() => {
    const { item } = props;
    if (typeof item === "string") return "";
    if (typeof item === "number") return "";
    return {
        text: item.tooltip || "",
        hotkey: item.hotkey,
    };
});
</script>

<template>
    <div
        v-tip="tooltip satisfies TooltipValue"
        class="flex cursor-pointer select-none items-center rounded bg-inherit p-3 text-surface-400 hover:bg-surface-700"
        v-ripple
    >
        <template v-if="typeof item === 'number' || typeof item === 'string'">
            <div class="label">
                {{ label }}
            </div>
        </template>
        <template v-else>
            <i class="pi text-xl" :class="item.icon" />
            <span class="label flex gap-2">
                <span>{{ label }}</span>
                <Hotkey v-if="!!item.hotkey" :hotkey="item.hotkey" />
            </span>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.selected {
    @apply bg-surface-700/60 text-surface-200 hover:bg-surface-700;
}

.label {
    @apply w-0 overflow-hidden font-semibold transition-all group-hover:w-40 group-hover:pl-3;
}
</style>
