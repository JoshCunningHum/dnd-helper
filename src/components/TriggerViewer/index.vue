<script setup lang="ts">
import Fill from "@/components/Fill.vue";
import { Node } from "@/types/Node";
import { State } from "@/types/States";
import { refAutoReset, set, useMouseInElement } from "@vueuse/core";
import { provide, ref, toRefs, watch } from "vue";
import Empty from "../Empty.vue";
import AddDialog from "./AddDialog.vue";
import Grid from "./Grid.vue";
import NodeViewer from "./NodeViewer.vue";
import { Condition } from "@/types/Condition";
import { computed } from "@vue/reactivity";

//#region CONFIG
const GRID_SIZE = 100;

const props = defineProps<{
    state: State;
    editable?: boolean;
}>();

const { editable, state } = toRefs(props);

//#region Selecting Nodes
const selected_node_id = ref<string>();
const selectNode = (id: string) => set(selected_node_id, id);
provide("triggerviewer-selectnode", selectNode);

const selected_node = computed(() =>
    state.value.nodes.find((n) => n.id === selected_node_id.value),
);

//#region Spanning
const oX = ref(0);
const oY = ref(0);
const resetSpanOffset = () => {
    set(oX, 0);
    set(oY, 0);
};
watch(state, resetSpanOffset);

//#region Adding Nodes
const canvas = ref<InstanceType<typeof HTMLDivElement>>();

// Only show add popup when clicking without moving
const { elementX, elementY } = useMouseInElement(canvas);
const hasMoved = ref(false);
const popup_pos = refAutoReset({ x: -100, y: -100 }, 1000);
const showAddPopup = () => {
    popup_pos.value = { x: -100, y: -100 };
    if (!editable.value || hasMoved.value) return;
    const x = elementX.value;
    const y = elementY.value;
    popup_pos.value = { x, y };
};
const persistPopup = () => set(popup_pos, popup_pos.value);

const add = (type: "Condition" | "Action") => {
    const { x, y } = popup_pos.value;
    const node = new Node({ x, y });

    if (type === "Condition") {
        const condition = new Condition({ node });
        state.value.nodes.push(condition);
        selected_node_id.value = condition.id;
    } else {
    }

    popup_pos.value = { x: -100, y: -100 };
};

//#region Editing
provide("triggerviewer-editing", editable);
</script>

<template>
    <Fill class="absolute h-full w-full flex-col">
        <Fill class="flex h-full w-full">
            <div class="relative h-full flex-grow cursor-grab overflow-hidden" ref="canvas">
                <Grid
                    v-model:offset-x="oX"
                    v-model:offset-y="oY"
                    :grid-size="GRID_SIZE"
                    @mousemove="() => (hasMoved = true)"
                    @mousedown="() => (hasMoved = false)"
                    @click="showAddPopup"
                />

                <NodeViewer :state :offset-x="oX" :offset-y="oY" :selected="selected_node_id" />

                <AddDialog
                    v-if="editable"
                    :x="popup_pos.x"
                    :y="popup_pos.y"
                    @persist-popup="persistPopup"
                    @add="add"
                />
            </div>
            <div class="min-w-48 border-l border-surface-700" v-if="editable">
                <Empty
                    v-if="!selected_node_id"
                    text="No node selected"
                    class="text-surface-400"
                    icon="pi pi-times-circle"
                />
            </div>
        </Fill>
        <div class="flex justify-between gap-2 border-t border-surface-700 p-2">
            <div class="space-x-2">
                <Button
                    icon="pi pi-bullseye"
                    text
                    v-tip="'Back to origin'"
                    @click="resetSpanOffset"
                />
            </div>
            <div class="space-x-2" v-if="editable">
                <Button size="small">Save</Button>
            </div>
        </div>
    </Fill>
</template>

<style lang="scss" scoped>
.add-popup {
    left: v-bind("popup_pos.x + 'px'");
    top: v-bind("popup_pos.y + 'px'");
    transform: translate(-50%, 10px);
}
</style>
