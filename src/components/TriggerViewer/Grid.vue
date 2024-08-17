<script setup lang="ts">
import { useElementSize, useMouseInElement, useMousePressed } from "@vueuse/core";
import { computed, ref, watch } from "vue";

const oX = defineModel<number>("offsetX", { required: true });
const oY = defineModel<number>("offsetY", { required: true });

const props = withDefaults(
    defineProps<{
        gridSize?: number;
    }>(),
    {
        gridSize: 100,
    },
);

//#region Spanning
const canvas = ref<InstanceType<typeof HTMLDivElement>>();
const { elementX: x, elementY: y } = useMouseInElement(canvas);

//#region Grid
const { height, width } = useElementSize(canvas);
const cellsX = computed(() => ~~(width.value / props.gridSize) + 2);
const cellsY = computed(() => ~~(height.value / props.gridSize) + 2);

//#region Panning
const { pressed } = useMousePressed({ target: canvas });
const pX = ref(0);
const pY = ref(0);

const loX = ref(0);
const loY = ref(0);

watch(pressed, () => {
    pX.value = x.value;
    pY.value = y.value;
    loX.value = oX.value;
    loY.value = oY.value;
});

watch([x, y], ([x, y]) => {
    if (!pressed.value) return;
    const dX = x - pX.value;
    const dY = y - pY.value;
    oX.value = loX.value + dX;
    oY.value = loY.value + dY;
});
</script>

<template>
    <div class="absolute h-full w-full cursor-move overflow-hidden" ref="canvas">
        <div
            v-for="i in cellsX"
            class="grid-line x"
            :style="{ left: (i - 1) * gridSize + (oX % gridSize) + 'px' }"
        />
        <div
            v-for="i in cellsY"
            class="grid-line y"
            :style="{ top: (i - 1) * gridSize + (oY % gridSize) + 'px' }"
        />
    </div>
</template>

<style lang="scss" scoped>
.grid-line {
    @apply absolute border-dotted border-surface-600;

    &.x {
        @apply h-full border-l;
    }

    &.y {
        @apply w-full border-t;
    }
}
</style>
