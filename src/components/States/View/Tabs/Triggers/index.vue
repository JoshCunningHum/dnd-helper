<script setup lang="ts">
import { inject, ref } from "vue";
import { State } from "../../../../../types/States";
import TriggerViewer from "../../../../TriggerViewer/index.vue";

const props = defineProps<{
    state: State;
}>();

//#region Open Edit Modal
const onEdit = inject("editStateTriggers", (_: State) => undefined);
</script>

<template>
    <div class="flex h-full min-h-0 flex-col gap-2 pt-2">
        <div class="relative flex-grow">
            <TriggerViewer class="flex-grow" :state />
        </div>
        <div class="absolute">
            <Button icon="pi pi-pencil" text label="Edit" @click="() => onEdit(state)" />
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
