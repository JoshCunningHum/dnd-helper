<script setup lang="ts">
import { useFileDialog, useObjectUrl } from "@vueuse/core";
import { Character } from "../../../types/Characters";
import ColorPicker from "primevue/colorpicker";

const props = defineProps<{
    character: Character;
}>();

const img_url = useObjectUrl(() => props.character.image);

const { open, files, onChange } = useFileDialog({
    accept: "image/*",
});

onChange(async (f) => {
    if (!f) return;
    const [file] = f;
    if (!file) return;
    const { character } = props;
    character.image = new Blob([await file.arrayBuffer()]);
});
</script>

<template>
    <div
        class="group relative flex size-44 cursor-pointer items-center justify-center rounded-full"
        :style="{
            borderColor: '#' + character.color,
            borderWidth: '5px',
        }"
    >
        <img
            v-if="img_url"
            class="h-full w-full overflow-hidden rounded-full"
            :src="img_url"
        />
        <span v-else class="opacity-100 transition-all group-hover:opacity-0">
            <i class="pi pi-user overflow-hidden rounded-full text-7xl" />
            <div class="label text-center">No Image</div>
        </span>
        <div
            @click="() => open()"
            class="absolute m-auto flex h-full w-full flex-col items-center justify-center rounded-full bg-surface-400 opacity-0 transition-all hover:opacity-70"
        >
            <i class="pi pi-pen-to-square text-5xl" />
            <div class="label text-center">Edit Image</div>
        </div>
        <div
            class="absolute -left-2 -top-2 size-6 rounded-full"
            :style="{
                backgroundColor: '#' + character.color,
            }"
            v-tip="'Change Color'"
        >
            <ColorPicker
                v-model="character.color"
                class="!size-6 !rounded-full"
                :pt="{
                    input: () => ({
                        class: '!size-6 rounded-full cursor-pointer',
                    }),
                }"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
