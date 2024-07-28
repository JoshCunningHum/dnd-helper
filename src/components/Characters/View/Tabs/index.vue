<script setup lang="ts">
import { CharacterTab, TabList, tabs } from "./types";

const model = defineModel<CharacterTab>({ default: tabs[0] });
</script>

<template>
    <div class="tab-container">
        <Button
            v-for="tab in tabs"
            severity="contrast"
            @click="model = tab"
            :key="tab.type"
            v-tip="'tooltip' in tab && tab.tooltip"
            :class="{
                selected: tab.type === model.type,
            }"
            >{{ tab.type }}</Button
        >
    </div>
</template>

<style lang="scss" scoped>
.tab-container {
    @apply flex;

    & > button {
        @apply rounded-none border-l-2 border-t-2 border-surface-700;

        &.selected {
            @apply bg-surface-700;
        }

        &:first-child {
            @apply rounded-tl;
        }

        &:last-child {
            @apply rounded-tr border-r-2;
        }
    }
}
</style>
