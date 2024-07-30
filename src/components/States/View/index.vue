<script setup lang="ts">
import { State } from "../../../types/States";

const props = defineProps<{
    state: State;
}>();
</script>

<template>
    <div>{{ state.name }}</div>
</template>

<style lang="scss" scoped></style>
