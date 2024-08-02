<script setup lang="ts">
import { set, useArrayFilter, useElementSize } from "@vueuse/core";
import { storeToRefs } from "pinia";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import { computed, ref, watch } from "vue";
import { useUrlParams } from "../../hooks/urlParams";
import { useConfigStore } from "../../stores/config";
import { useStatesStore } from "../../stores/states";
import cycleShift from "../../utils/cycleShift";
import List from "./List/index.vue";
import View from "./View/index.vue";
import { useCharactersStore } from "../../stores/characters";
import Hotkey from "../Hotkey.vue";
import stringComparator from "../../utils/stringComparator";

//#region Hotkeys
const { getkey } = useConfigStore();

//#region States
const store = useStatesStore();
const { selected, states } = storeToRefs(store);

//#region Filter Characters
const characterStore = useCharactersStore();
const search = useUrlParams("statesearch", "");
const tags = useUrlParams<string[]>("statetags", []);
const chars = useUrlParams<number[]>("statechars", []);
const filtered_states = useArrayFilter(states, (s) => {
    const characters = [...characterStore.characters].sort((a, b) =>
        stringComparator(a.name, b.name),
    );
    const str_search = search.value.toLowerCase();
    const filter_tags = tags.value;
    const filter_chars = chars.value;

    // Check if state passes the search str test
    const search_valid = !str_search || s.name.toLowerCase().includes(str_search);

    // Check if state passes the include tags test
    let tags_valid = false;
    if (filter_tags.length) {
        if (Array.isArray(s.attached)) tags_valid = s.attached.some((t) => filter_tags.includes(t));
        else tags_valid = s.attached.tags.some((t) => filter_tags.includes(t));
    } else tags_valid = true;

    // Check if state passes the character test
    let chars_valid = false;
    if (filter_chars.length) {
        if (Array.isArray(s.attached)) {
            // Check if the character's tags is included in the state
            const tags = [
                ...filter_chars
                    .map((id) => characters.find((c) => c.id === id))
                    .filter((c) => !!c)
                    .reduce((acc, curr) => {
                        curr.tags.forEach((t) => acc.add(t));
                        return acc;
                    }, new Set<string>()),
            ];

            chars_valid = s.attached.some((t) => tags.includes(t));
        } else {
            // Check if character id is the state.attached
            chars_valid = filter_chars.includes(s.attached.id);
        }
    } else chars_valid = true;

    return search_valid && tags_valid && chars_valid;
});

//#region List
const index = ref(states.value.findIndex((s) => s.id === selected.value?.id));
watch(index, (v) => set(selected, filtered_states.value[v]));

const shift = (n: number) => set(index, cycleShift(index.value, filtered_states.value.length, n));
//#region Splitter Ratio
const config = useConfigStore();
const { ui } = storeToRefs(config);

const left = computed({
    get: () => ui.value.menu_state_splitter_left,
    set: (v) => (ui.value.menu_state_splitter_left = v),
});
const right = computed(() => 100 - left.value);

//#region Sidebar Width
const root = ref<InstanceType<typeof HTMLDivElement>>();
const { width } = useElementSize(root);
const sidebar_width = computed(() => (width.value * left.value) / 100 - 4);
const content_width = computed(() => width.value - sidebar_width.value - 5);
</script>

<template>
    <div class="h-full" style="width: calc(100vw - 55px)" ref="root">
        <Hotkey :hotkey="getkey('states.prev')" hidden @press="() => shift(-1)" />
        <Hotkey :hotkey="getkey('states.next')" hidden @press="() => shift(1)" />
        <Splitter
            class="h-full w-full !border-none !bg-transparent py-2"
            @resize="(v) => (left = v.sizes[0])"
        >
            <SplitterPanel class="px-2" :size="left" :min-size="30">
                <List
                    :style="{ width: sidebar_width + 'px' }"
                    :states="filtered_states"
                    v-model:index="index"
                />
            </SplitterPanel>
            <SplitterPanel :min-size="40" :size="right">
                <View
                    v-if="!!selected"
                    :style="{
                        maxWidth: content_width + 'px',
                    }"
                    @next="() => shift(1)"
                    @prev="() => shift(-1)"
                    :state="selected"
                />
            </SplitterPanel>
        </Splitter>
    </div>
</template>

<style lang="scss" scoped></style>
