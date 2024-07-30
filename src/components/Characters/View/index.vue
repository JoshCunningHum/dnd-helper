<script setup lang="ts">
import { toRefs, useDebounceFn } from "@vueuse/core";
import { ref, watch } from "vue";
import { Character } from "../../../types/Characters";
import Fill from "../../Fill.vue";
import Image from "./Image.vue";
import Name from "./Name.vue";
import Operations from "./Operations.vue";
import Tabs from "./Tabs/index.vue";
import { CharacterTab, useCharacterTabs } from "./Tabs/types";
import Tags from "./Tags.vue";

const { tabs } = useCharacterTabs();

const props = defineProps<{
    character: Character;
}>();

const { character: char } = toRefs(props);

const emits = defineEmits<{
    (e: "next"): void;
    (e: "prev"): void;
}>();

//#region Mutation Listener (for updating)
const update = useDebounceFn(() => {
    char.value.update();
}, 250);
watch(char, update, { deep: true });

//#region Tabs
const tab = ref<CharacterTab>(tabs[0]);
</script>

<template>
    <div class="flex !h-screen min-w-0 flex-col overflow-x-auto px-2">
        <div class="flex select-none">
            <Operations
                class="mr-4"
                @next="() => emits('next')"
                @prev="() => emits('prev')"
                :character="char"
            />
            <div class="pb-4">
                <Image class="m-4" :character="char" />
            </div>
            <div class="flex flex-grow flex-col justify-between">
                <div class="flex flex-col">
                    <Name :character="char" />
                    <Tags :character="char" />
                </div>
                <Tabs v-model="tab" />
            </div>
        </div>
        <Fill class="wrapper overflow-y-auto">
            <component
                class="min-h-min w-full border-t-2 border-surface-700"
                :character="character"
                :is="tab.component"
            />
        </Fill>
    </div>
</template>

<style lang="scss" scoped></style>
