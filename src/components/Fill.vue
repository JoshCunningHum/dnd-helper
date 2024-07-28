<script lang="ts" setup>
const {
    overflowScrollY = true,
    overflowScrollX = false,
    noFlex = false,
    flexCol = false,
    center = false,
    hasGutter = false,
    noGrow = false,
} = defineProps<{
    overflowScrollY?: boolean;
    overflowScrollX?: boolean;
    noFlex?: boolean;
    flexCol?: boolean;
    center?: boolean;
    hasGutter?: boolean;
    noGrow?: boolean;
}>();
</script>

<template>
    <div
        class="h-full w-full min-h-0"
        :class="[
            overflowScrollY && 'overflow-y-auto',
            overflowScrollX && 'overflow-x-auto',
            !noFlex && 'flex',
            flexCol && 'flex-col',
            !flexCol && 'flex-row',
            center && 'items-center',
            center && 'justify-center',
            !noGrow && 'flex-grow',
        ]"
        :style="{ scrollbarGutter: hasGutter ? 'stable' : 'auto' }"
    >
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped></style>
