<script setup lang="ts">
import { get, set, syncRef } from "@vueuse/core";
import { computed, ref } from "vue";
import WYSWYG from "../../../../lib/WYSWYG/index.vue";
import { State } from "../../../../types/States";
import Empty from "../../../Empty.vue";

const props = defineProps<{
    state: State;
}>();
const description = computed(() => props.state.description);

const isEditing = ref(false);
const startEditing = () => set(isEditing, true);
const endEditing = () => {
    set(isEditing, false);
    set(temp, get(description));
};
const saveEdit = () => {
    props.state.description = temp.value;
    endEditing();
};

const temp = ref<string>();
syncRef(temp, description, { direction: "rtl" });

//#region Detect for empty text content
const isEmptyText = computed(() => {
    const el = document.createElement("div");
    if (!description.value) return true;
    el.innerHTML = description.value;
    return !el.innerText.trim() && !description.value.includes("img");
});
</script>

<template>
    <div
        class="character-description tiptap flex h-full min-h-0 w-full min-w-0 flex-col gap-2 overflow-y-auto pb-2 pr-2"
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
                <Button severity="secondary" @click="startEditing"> Add Description </Button>
            </Empty>
            <div
                @dblclick="startEditing"
                v-html="state.description"
                v-else
                class="h-full p-2"
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

<style>
.character-description {
    img {
        border-radius: 5px;
    }
}
</style>
