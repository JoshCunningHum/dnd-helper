<script setup lang="ts">
import { Action } from "@/types/Action";
import { Condition } from "@/types/Condition";
import { computed } from "vue";
import NodeEditorCondition from "./NodeEditorCondition.vue";
import { State } from "@/types/States";

const props = defineProps<{
    node: Condition | Action;
    state: State;
}>();

const isCondition = computed(() => "string" in props.node);
</script>

<template>
    <Fill flex-col class="p-2">
        <div
            class="text-xs"
            :class="{
                'text-amber-500': !isCondition,
                'text-sky-500': isCondition,
            }"
        >
            {{ isCondition ? "Condition" : "Action" }}
        </div>

        <NodeEditorCondition :state v-if="'string' in node" :condition="node" />
    </Fill>
</template>

<style lang="scss" scoped></style>
