<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { useStatesStore } from "../../../stores/states";
import { State } from "../../../types/States";
import { storeToRefs } from "pinia";
import hasScrollbars from "../../../utils/hasScrollbars";
import Filter from "./Filter.vue";
import Empty from "../../Empty.vue";
import Item from "./Item.vue";
import stringComparator from "../../../utils/stringComparator";

//#region Component Props
const index = defineModel<number>("index", { default: 0 });
const props = defineProps<{
    states: State[];
}>();

//#region States
const store = useStatesStore();
const { selected } = storeToRefs(store);

//#region Show gutters when scrollbar is on
const list = ref<InstanceType<typeof HTMLDivElement>>();
const scrollable = computed(() => hasScrollbars(list));
</script>

<template>
    <div class="flex h-full w-full min-w-0 flex-col">
        <Filter class="w-full" />
        <div
            class="flex w-full flex-grow flex-wrap content-start items-start gap-2 overflow-y-auto py-2"
            :class="{
                gutter: scrollable,
            }"
        >
            <template v-if="states.length">
                <Item
                    v-for="(state, i) in states"
                    :state="state"
                    :key="state.id"
                    @click="index = i"
                    :class="{ selected: state.id === selected?.id }"
                />
            </template>
            <Empty v-else text="Empty States" />
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
