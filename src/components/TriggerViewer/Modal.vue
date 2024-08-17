<script setup lang="ts">
import Dialog from "primevue/dialog";
import TriggerView from "@/components/TriggerViewer/index.vue";
import { computed, PropType } from "vue";
import { State } from "@/types/States";

// This is an edit modal
const state = defineModel<State>("state");

const open = computed({
    get: () => !!state.value,
    set: (_) => (state.value = undefined),
});
</script>

<template>
    <Dialog
        v-model:visible="open"
        modal
        header="Edit Trigger"
        close-on-escape
        closable
        dismissable-mask
        :pt="{
            root: () => ({
                class: '',
            }),
        }"
    >
        <template #container="{ closeCallback }">
            <div
                class="left-0 flex !h-[90vh] !w-[90vw] !max-w-[100vw] flex-col rounded bg-surface-800 text-white"
            >
                <div class="flex items-center justify-between p-4 pb-3 text-surface-400">
                    <span>Edit Triggers</span>
                    <i
                        class="pi pi-times cursor-pointer hover:text-surface-300"
                        @click="closeCallback"
                    />
                </div>
                <div class="relative flex-grow">
                    <TriggerView
                        class="border border-surface-700"
                        v-if="!!state"
                        :state="state"
                        :editable="true"
                    />
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style lang="scss" scoped></style>
