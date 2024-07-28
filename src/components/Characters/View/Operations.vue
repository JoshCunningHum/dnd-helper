<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useConfigStore } from "../../../stores/config";
import { Character } from "../../../types/Characters";
import Hotkey from "../../Hotkey.vue";
import { useQuery } from "../../../hooks/query";
import { useCharactersStore } from "../../../stores/characters";

const props = defineProps<{
    character: Character;
}>();

const emits = defineEmits<{
    (e: "next"): void;
    (e: "prev"): void;
}>();

const config = useConfigStore();
const { hotkeys } = storeToRefs(config);

const store = useCharactersStore();

const { ask } = useQuery();

//#region Deletion
const onDelete = async () => {
    await ask({
        title: `Delete ${props.character.name}?`,
        approveText: "Delete",
        description: `All data with this character will be lost`,
        then: async () => {
            await store.remove(props.character);
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
                    hotkey: hotkeys.characters.prev,
                }"
                icon="pi pi-arrow-up"
                @click="emits('prev')"
            />
            <Button
                severity="contrast"
                v-tip="{ text: 'Next', hotkey: hotkeys.characters.next }"
                icon="pi pi-arrow-down"
                @click="emits('next')"
            />
            <Hotkey
                @press="onDelete"
                hidden
                :hotkey="hotkeys.characters.delete"
            />
            <Button
                severity="danger"
                v-tip="{
                    text: 'Delete Character',
                    hotkey: hotkeys.characters.delete,
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
