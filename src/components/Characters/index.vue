<script setup lang="ts">
import { get, set, useElementSize } from "@vueuse/core";
import { storeToRefs } from "pinia";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import { computed, onMounted, ref, watch } from "vue";
import { useUrlParams } from "../../hooks/urlParams";
import { useCharactersStore } from "../../stores/characters";
import { useConfigStore } from "../../stores/config";
import Hotkey from "../Hotkey.vue";
import List from "./List/index.vue";
import View from "./View/index.vue";

//#region Characters
const store = useCharactersStore();
const { characters, selected } = storeToRefs(store);

//#region Filter Characters
const search = useUrlParams("search", "");
const tags = useUrlParams("tags", []);
const filtered_characters = computed(() => {
    const arr = characters.value;
    const search_str = search.value.toLowerCase();
    const _tags = tags.value;
    return arr.filter((c) => {
        return (
            (!search_str || c.name.toLowerCase().includes(search_str)) &&
            (!_tags.length || _tags.some((t) => c.tags.includes(t)))
        );
    });
});

const index = ref(characters.value.findIndex((c) => c.id === selected.value?.id));
watch(index, (v) => set(selected, filtered_characters.value[v]));

const shift = (n: number) => {
    const len = filtered_characters.value.length;
    if (len === 0) return;
    const res = (get(index) + n) % len;
    if (res < 0) set(index, len + res);
    else set(index, res);
};

//#region Splitter Ratio
const config = useConfigStore();
const { ui, hotkeys } = storeToRefs(config);

const left = computed({
    get: () => ui.value.menu_char_splitter_left,
    set: (v) => (ui.value.menu_char_splitter_left = v),
});
const right = computed(() => 100 - left.value);

//#region Sidebar computed width
const root = ref<InstanceType<typeof HTMLDivElement>>();
const { width } = useElementSize(root);
const sidebar_width = computed(() => (width.value * left.value) / 100 - 4);
const content_width = computed(() => width.value - sidebar_width.value - 5);
</script>

<template>
    <div class="h-full" style="width: calc(100vw - 55px)" ref="root">
        <Hotkey :hotkey="hotkeys.characters.next" hidden @press="() => shift(1)" />
        <Hotkey :hotkey="hotkeys.characters.prev" hidden @press="() => shift(-1)" />
        <Splitter class="h-full w-full !border-none !bg-transparent py-2" @resize="(v) => (left = v.sizes[0])">
            <SplitterPanel class="px-2" :size="left" :min-size="15">
                <List
                    :style="{ width: sidebar_width + 'px' }"
                    :characters="filtered_characters"
                    v-model:index="index"
                />
            </SplitterPanel>
            <SplitterPanel :min-size="70" :size="right">
                <View
                    v-if="!!selected"
                    :style="{
                        maxWidth: content_width + 'px',
                    }"
                    @next="() => shift(1)"
                    @prev="() => shift(-1)"
                    :character="selected"
                />
            </SplitterPanel>
        </Splitter>
    </div>
</template>
