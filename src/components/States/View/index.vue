<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { markRaw, ref, toRefs, watch } from "vue";
import { State } from "../../../types/States";
import { CharacterTab } from "../../Characters/View/Tabs/types";
import Hotkey from "../../Hotkey.vue";
import Name from "./Name.vue";
import Operations from "./Operations.vue";
import Description from "./Tabs/Description.vue";
import Triggers from "./Tabs/Triggers/index.vue";
import Tags from "./Tags.vue";
import { useConfigStore } from "../../../stores/config";

const props = defineProps<{
    state: State;
}>();

const { state } = toRefs(props);

const emits = defineEmits<{
    (e: "next"): void;
    (e: "prev"): void;
}>();

//#region Mutation Listener (for updating)
const update = useDebounceFn(() => {
    state.value.update();
}, 250);
watch(state, update, { deep: true });

//#region Tabs
const { getkey } = useConfigStore();
const tabs = [
    {
        type: "Description",
        component: markRaw(Description),
        tooltip: {
            text: /* html */ `<strong>Description</strong><br />Double click to edit`,
            hotkey: getkey("states.description"),
        },
    },
    {
        type: "Triggers",
        component: markRaw(Triggers),
        tooltip: {
            text: /* html */ `<strong>Triggers</strong><br />`,
            hotkey: getkey("states.triggers"),
        },
    },
] as const as CharacterTab<{ state: State }>[];
const current = ref<CharacterTab<{ state: State }>>(tabs[0]);
</script>

<template>
    <div class="flex h-full flex-col gap-2 p-2">
        <div class="flex w-full">
            <Operations
                class="mr-4"
                @next="() => emits('next')"
                @prev="() => emits('prev')"
                :state="state"
            />
            <div class="flex flex-col">
                <Name :state="state" />
                <Tags :state="state" />
            </div>
        </div>
        <div class="flex min-h-0 flex-grow flex-col">
            <div class="tab-container">
                <Button
                    v-for="(tab, i) in tabs"
                    severity="contrast"
                    :key="i"
                    @click="current = tab"
                    v-tip="'tooltip' in tab && tab.tooltip"
                    :class="{
                        selected: tab.type === current?.type,
                    }"
                >
                    {{ tab.type }}
                    <Hotkey
                        v-if="
                            tab.tooltip &&
                            typeof tab.tooltip !== 'string' &&
                            tab.tooltip.hotkey &&
                            typeof tab.tooltip.hotkey === 'string'
                        "
                        hidden
                        :hotkey="tab.tooltip.hotkey"
                    />
                </Button>
            </div>
            <component
                class="min-h-min w-full flex-grow border-t-2 border-surface-700"
                :state="state"
                :is="current.component"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tab-container {
    @apply flex border-b border-surface-700 pl-14;

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
