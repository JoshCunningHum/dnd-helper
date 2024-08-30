<script setup lang="ts">
import { State } from "@/types/States";
import { computed } from "vue";
import Node from "./Node.vue";
import { useQuery } from "@/hooks/query";
import * as yup from "yup";

const props = defineProps<{
    state: State;
    offsetX: number;
    offsetY: number;
    selected?: string;
}>();

const nodes = computed(() => props.state.nodes);

//#region Delete Node
const { ask } = useQuery();
const remove = async (index: number) => {
    const data = await ask({
        title: "Delete node?",
        description: "Deleting this node will also remove existing connections",
        approveText: "Delete node",
        then: async () => {
            props.state.nodes.splice(index, 1);
        },
    });
};
</script>

<template>
    <div class="offset absolute !h-0 !w-0 overflow-visible">
        <span class="p-1 text-xs text-surface-400">origin</span>
        <Node
            v-for="(node, index) in nodes"
            :index
            :key="node.id"
            :node
            :state
            :selected="node.id === selected"
            @delete="remove"
        />
    </div>
</template>

<style lang="scss" scoped>
.offset {
    left: v-bind("offsetX + 'px'");
    top: v-bind("offsetY + 'px'");
}
</style>
