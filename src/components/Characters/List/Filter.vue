<script setup lang="ts">
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import InputGroup from "primevue/inputgroup";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import { ref } from "vue";
import { useUrlParams } from "../../../hooks/urlParams";
import { useCharactersStore } from "../../../stores/characters";
import { useConfigStore } from "../../../stores/config";
import Hotkey from "../../Hotkey.vue";
import Add from "./Add.vue";

const search = useUrlParams("charsearch", "");
const inpsearch = ref<InstanceType<typeof HTMLInputElement>>();

//#region Search Focus Hotkey
const configStore = useConfigStore();
const { hotkeys } = storeToRefs(configStore);

const setInpSearch = (inp: HTMLInputElement) => set(inpsearch, inp);
const timeout = (cb: () => void) => setTimeout(() => cb(), 50);
const focus = (v: boolean) => (v ? inpsearch.value?.focus() : inpsearch.value?.blur());

//#region Filter Tags
const store = useCharactersStore();
const { tags: tag_options } = storeToRefs(store);

const tags = useUrlParams<string[]>("chartags", []);
</script>

<template>
    <InputGroup
        v-tip="{
            text: /* html */ `<strong>Characters</strong>`,
            hotkey: {
                Search: hotkeys.characters.search_focus,
                Next: hotkeys.characters.next,
                Previous: hotkeys.characters.prev,
            },
        }"
    >
        <Hotkey hidden :hotkey="hotkeys.characters.search_focus" @press="() => focus(true)" />
        <InputText
            v-model="search"
            placeholder="Search characters..."
            class="h-8 rounded-l-none"
            @keydown.enter="() => focus(false)"
            :pt="{ root: (_) => timeout(() => setInpSearch(_.instance.$el)) }"
        />
        <MultiSelect
            v-model="tags"
            :options="tag_options"
            pt:labelContainer:class="hidden"
            :pt:root:class="[
                // Display and Position
                'inline-flex',
                'relative',

                // Shape
                'shadow-sm',

                // Color and Background
                'bg-surface-0 dark:bg-surface-900 border border-surface-600',

                // Misc
                'cursor-default',
                'select-none',
            ]"
            pt:trigger:class="px-2 items-center flex"
        >
            <template #value> <p></p> </template>
            <template #dropdownicon>
                <i v-if="!!tags.length" v-badge.danger="tags.length" class="pi pi-filter text-surface-300" />
                <i v-else class="pi pi-filter text-surface-300" />
            </template>
            <template #empty>
                <p></p>
            </template>
            <template #content>
                <p></p>
            </template>
            <template #loader>
                <p></p>
            </template>
        </MultiSelect>
        <Add />
    </InputGroup>
</template>

<style lang="scss" scoped></style>
