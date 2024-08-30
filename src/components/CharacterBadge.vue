<script setup lang="ts">
import { Character } from "@/types/Characters";

const props = defineProps<{
    character: Character;
}>();
</script>

<template>
    <span class="flex items-center gap-2">
        <span
            class="size-2 rounded-full"
            :style="{
                backgroundColor: '#' + props.character.color,
            }"
        ></span>
        <span> {{ character.name }}</span>
    </span>
</template>

<style lang="scss" scoped></style>
