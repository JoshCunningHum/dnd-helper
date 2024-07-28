<script setup lang="ts">
import { computedWithControl, get, set, syncRef } from "@vueuse/core";
import { computed, ref } from "vue";
import WYSWYG from "../../../../lib/WYSWYG/index.vue";
import { Character } from "../../../../types/Characters";
import Empty from "../../../Empty.vue";

const props = defineProps<{
    character: Character;
}>();
const description = computed(() => props.character.description);

const isEditing = ref(false);
const startEditing = () => set(isEditing, true);
const endEditing = () => {
    set(isEditing, false);
    set(temp, get(description));
};
const saveEdit = () => {
    props.character.description = temp.value;
    endEditing();
};

const temp = ref<string>();
syncRef(temp, description, { direction: "rtl" });

//#region Detect for empty text content
const isEmptyText = computed(() => {
    const el = document.createElement("div");
    if (!description.value) return true;
    el.innerHTML = description.value;
    return !el.innerText.trim();
});
</script>

<template>
    <div
        class="flex h-full min-h-0 w-full min-w-0 flex-col gap-2 overflow-y-auto pb-2 pr-2"
    >
        <template v-if="!isEditing">
            <Empty
                v-if="isEmptyText"
                @dblclick="startEditing"
                icon="pi pi-times-circle"
                class="flex h-full items-center justify-center text-center text-surface-500"
            >
                This character is so boring <br />
                it has no description <br />
                <Button severity="secondary" @click="startEditing">
                    Add Description
                </Button>
            </Empty>
            <div
                @dblclick="startEditing"
                v-html="character.description"
                v-else
                class="h-full px-2 py-1"
            ></div>
        </template>

        <template v-else>
            <WYSWYG v-model="temp" class="w-full flex-grow" />
            <div class="flex justify-end gap-2">
                <Button @click="endEditing" severity="secondary">Cancel</Button>
                <Button @click="saveEdit">Save</Button>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped></style>
