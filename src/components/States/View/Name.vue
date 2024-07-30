<script setup lang="ts">
import { computed, ref } from "vue";
import { useConfigStore } from "../../../stores/config";
import { State } from "../../../types/States";
import { onClickOutside, set, unrefElement } from "@vueuse/core";
import Hotkey from "../../Hotkey.vue";

const { getkey } = useConfigStore();

const props = defineProps<{
    state: State;
}>();

const name = computed(() => props.state.name);

//#region Editing
const root = ref<InstanceType<typeof HTMLDivElement>>();
const editable = ref<InstanceType<typeof HTMLDivElement>>();
const isEditing = ref(false);

const onKeyDown = (e: KeyboardEvent) => {
    const r = unrefElement(editable);
    if (!isEditing.value || !r) return;
    if (e.key !== "Enter") return;
    e.preventDefault();

    const txt = r.innerText.trim() || name.value;
    props.state.name = txt;
    r.textContent = txt;
    set(isEditing, false);
};

const onCancel = () => {
    const r = unrefElement(editable);
    if (!isEditing.value || !r) return;
    r.innerText = name.value;
    set(isEditing, false);
};

onClickOutside(root, onCancel);

const startEditing = () => {
    const div = unrefElement(editable);
    if (!div) return;
    set(isEditing, true);
    setTimeout(() => {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(div);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
        div.focus();
    }, 0);
};
</script>

<template>
    <div class="group flex w-full items-center rounded" ref="root" @keydown="onKeyDown">
        <div>
            <div class="flex items-end">
                <div
                    ref="editable"
                    :contenteditable="isEditing"
                    spellcheck="false"
                    v-text="name"
                    :class="{
                        editing: isEditing,
                    }"
                    class="h2 p-1 px-2"
                ></div>
                <div class="select-none text-sm text-surface-400">Id: {{ state.id }}</div>
            </div>
            <small v-if="isEditing" class="ml-2"
                >Press <span class="text-green-600">enter</span> to submit or press
                <span class="text-red-400">escape</span> to cancel</small
            >
        </div>
        <Button
            v-if="!isEditing"
            icon="pi pi-pen-to-square"
            text
            class="hidden group-hover:block"
            severity="contrast"
            @click="startEditing"
            v-tip="{
                text: 'Rename',
                hotkey: 'F2',
            }"
        />
        <Hotkey :hotkey="getkey('states.rename')" hidden @press="startEditing" />
        <Hotkey hotkey="escape" hidden @press="onCancel" />
    </div>
</template>

<style lang="scss" scoped>
.editing {
    @apply rounded border border-surface-600 bg-surface-900;
}
</style>
