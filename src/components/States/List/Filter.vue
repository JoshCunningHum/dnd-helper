<script setup lang="ts">
import { set, useArrayMap } from "@vueuse/core";
import { storeToRefs } from "pinia";
import MultiSelect from "primevue/multiselect";
import { ref } from "vue";
import { useUrlParams } from "../../../hooks/urlParams";
import { useCharactersStore } from "../../../stores/characters";
import { useConfigStore } from "../../../stores/config";
import Hotkey from "../../Hotkey.vue";
import Add from "./Add.vue";

const search = useUrlParams("statesearch", "");
const inpsearch = ref<InstanceType<typeof HTMLInputElement>>();

//#region Search Focus Hotkey
const { getkey } = useConfigStore();

const initInpSearch = (inp: HTMLInputElement) => set(inpsearch, inp);
const timeout = (cb: () => void) => setTimeout(() => cb(), 50);
const focus = (v: boolean) => (v ? inpsearch.value?.focus() : inpsearch.value?.blur());

//#region Filter Tags
const charStore = useCharactersStore();
const { tags: tag_options, characters } = storeToRefs(charStore);
const char_options = useArrayMap(characters, (c) => ({ name: c.name, value: c.id }));

const tags = useUrlParams<string[]>("statetags", []);
const chars = useUrlParams<number[]>("statechars", []);
</script>

<template>
    <InputGroup
        v-tip="{
            text: /* html */ `<strong>States</strong>`,
            hotkey: {
                Search: getkey('states.search_focus'),
                Next: getkey('states.next'),
                Previous: getkey('states.prev'),
            },
        }"
    >
        <Hotkey hidden :hotkey="getkey('states.search_focus')" @press="() => focus(true)" />
        <InputText
            v-model="search"
            placeholder="Search states..."
            class="h-8 rounded-l-lg"
            @keydown.enter="() => focus(false)"
            :pt="{ root: (_) => timeout(() => initInpSearch(_.instance.$el)) }"
        />
        <MultiSelect
            v-model="tags"
            :options="tag_options"
            pt:trigger:class="px-2 items-center flex"
            pt:labelContainer:class="hidden"
            :pt:root:class="[
                'inline-flex',
                'relative',
                'shadow-sm',
                'bg-surface-0 dark:bg-surface-900 border border-surface-600',
                'cursor-default',
                'select-none',
            ]"
        >
            <template #value> <p></p> </template>
            <template #dropdownicon>
                <i
                    v-if="!!tags.length"
                    v-badge.danger="tags.length"
                    class="pi pi-filter text-surface-300"
                />
                <i v-else class="pi pi-filter text-surface-300" />
            </template>
        </MultiSelect>
        <MultiSelect
            v-model="chars"
            :options="char_options"
            pt:trigger:class="px-2 items-center flex"
            pt:labelContainer:class="hidden"
            :pt:root:class="[
                'inline-flex',
                'relative',
                'shadow-sm',
                'bg-surface-0 dark:bg-surface-900 border border-surface-600',
                'cursor-default',
                'select-none',
            ]"
            optionLabel="name"
            optionValue="value"
        >
            <template #value> <p></p> </template>
            <template #dropdownicon>
                <i
                    v-if="!!chars.length"
                    v-badge.danger="chars.length"
                    class="pi pi-user text-surface-300"
                />
                <i v-else class="pi pi-user text-surface-300" />
            </template>
        </MultiSelect>
        <Add />
    </InputGroup>
</template>

<style lang="scss" scoped></style>
