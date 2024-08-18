<script setup lang="ts">
import { State } from "@/types/States";
import { computed } from "vue";
import Node from "./Node.vue";

const props = defineProps<{
    state: State;
    offsetX: number;
    offsetY: number;
    selected?: string;
}>();

const nodes = computed(() => props.state.nodes);
</script>

<template>
    <div class="offset absolute !h-0 !w-0 overflow-visible">
        <span class="p-1 text-xs text-surface-400">origin</span>

        <Node v-for="node in nodes" :key="node.id" :node :selected="node.id === selected" />
    </div>
</template>

<style lang="scss" scoped>
.offset {
    left: v-bind("offsetX + 'px'");
    top: v-bind("offsetY + 'px'");
}
</style>
