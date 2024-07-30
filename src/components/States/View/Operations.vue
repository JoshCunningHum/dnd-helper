<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useQuery } from "../../../hooks/query";
import { useConfigStore } from "../../../stores/config";
import { useStatesStore } from "../../../stores/states";
import { State } from "../../../types/States";
import Hotkey from "../../Hotkey.vue";

const props = defineProps<{
    state: State;
}>();

const emits = defineEmits<{
    (e: "next"): void;
    (e: "prev"): void;
}>();

const { getkey } = useConfigStore();

const store = useStatesStore();

const { ask } = useQuery();

//#region Deletion
const onDelete = async () => {
    await ask({
        title: `Delete ${props.state.name}?`,
        approveText: "Delete",
        description: `All data concerning this state will be lost`,
        then: async () => {
            await store.remove(props.state);
        },
    });
};
</script>

<template>
    <div class="flex flex-col">
        <InputGroup class="btngroup vertical">
            <Button
                severity="contrast"
                v-tip="{
                    text: 'Previous',
                    hotkey: getkey('states.prev'),
                }"
                icon="pi pi-arrow-up"
                @click="emits('prev')"
            />
            <Button
                severity="contrast"
                v-tip="{ text: 'Next', hotkey: getkey('states.next') }"
                icon="pi pi-arrow-down"
                @click="emits('next')"
            />
            <Hotkey @press="onDelete" hidden :hotkey="getkey('states.delete')" />
            <Button
                severity="danger"
                v-tip="{
                    text: 'Delete State',
                    hotkey: getkey('states.delete'),
                }"
                icon="pi pi-trash"
                @click="onDelete"
            />
        </InputGroup>
    </div>
</template>

<style lang="scss" scoped>
.btngroup {
    @apply rounded border border-surface-600 [&>button]:rounded-none [&>button]:border-surface-600;

    &.vertical {
        @apply flex flex-col [&>button:first-child]:rounded-t [&>button:last-child]:rounded-b [&>button:not(:last-child)]:border-b;
    }

    &:not(&.vertical) {
        @apply [&>button:first-child]:rounded-l [&>button:last-child]:rounded-r [&>button:not(:last-child)]:border-r;
    }
}
</style>
