<script setup lang="ts">
import { get, set } from "@vueuse/core";
import ContextMenu, { ContextMenuProps } from "primevue/contextmenu";
import { computed, ref, toRefs } from "vue";
import { useCharactersStore } from "../../../stores/characters";
import { Character } from "../../../types/Characters";
import Empty from "../../Empty.vue";
import Filter from "./Filter.vue";
import Item from "./Item.vue";
import { useQuery } from "../../../hooks/query";

//#region List Data
const index = defineModel<number>("index", { default: 0 });
const props = defineProps<{
    characters: Character[];
}>();

const store = useCharactersStore();
const { characters } = toRefs(props);

const { ask } = useQuery();

//#region Delete
const onDelete = async () => {
    const target = context_target.value;
    if (!target) return;

    await ask({
        title: `Delete ${target.name}?`,
        approveText: "Delete",
        description: `All data with this character will be lost`,
        then: async () => await store.remove(target),
    });
};

//#region Context Menu
const menu = ref<ContextMenu>();
const menu_items = ref<ContextMenuProps["model"]>([{ label: "Delete", icon: "pi pi-trash", command: onDelete }]);
const context_target = ref<Character>();
const onContextMenu = (event: MouseEvent, item: Character) => {
    set(context_target, item);
    get(menu)?.show(event);
};

//#region Show gutters when scrollbar is on
const list = ref<InstanceType<typeof HTMLDivElement>>();
const hasScrollbars = computed(() => (list.value?.scrollHeight || 0) > (list.value?.clientHeight || 0));
</script>

<template>
    <div class="flex h-full w-full min-w-0 flex-col">
        <Filter class="w-full" />
        <div
            class="flex w-full flex-grow flex-col gap-2 overflow-y-auto py-2"
            :class="{
                gutter: hasScrollbars,
            }"
            ref="list"
        >
            <template v-if="characters.length">
                <Item
                    v-for="(char, i) in characters"
                    :key="char.id"
                    :char="char"
                    @contextmenu="(e) => onContextMenu(e, char)"
                    @click="index = i"
                    :class="{ selected: index === i }"
                />
            </template>
            <template v-else>
                <Empty text="Empty Characters..." />
            </template>
            <ContextMenu ref="menu" :model="menu_items" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.gutter {
    padding-right: 7.5px;
    margin-top: 5px;
    scrollbar-gutter: stable both-edges;
}
</style>
