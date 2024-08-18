<script setup lang="ts">
import { useDrag } from "@/hooks/drag";
import { Action } from "@/types/Action";
import { Condition } from "@/types/Condition";
import uuid from "@/utils/uuid";
import {
    get,
    set,
    useDraggable,
    useElementBounding,
    useElementSize,
    useMousePressed,
    useParentElement,
} from "@vueuse/core";
import { computed, inject, ref, watch } from "vue";

const props = defineProps<{
    node: Action | Condition;
    selected?: boolean;
}>();

const isCondition = computed(() => "string" in props.node);
const editing = inject("triggerviewer-editing", ref(false));

//#region Select Node
const component_id = uuid(16);
const selectNode = inject("triggerviewer-selectnode", (id: string) => undefined);

//#region Dragging
const root = ref<InstanceType<typeof HTMLDivElement>>();
const x = computed({
    get: () => props.node.node.x,
    set: (v) => (props.node.node.x = v),
});
const y = computed({
    get: () => props.node.node.y,
    set: (v) => (props.node.node.y = v),
});
const lX = ref(0);
const lY = ref(0);

const onDragStart = () => {
    set(lX, get(x));
    set(lY, get(y));
    if (editing.value) selectNode(props.node.id);
};

const { pressed: isDragging } = useDrag(root, {
    onStart: onDragStart,
    onMove: (dx, dy) => {
        x.value = lX.value + dx;
        y.value = lY.value + dy;
    },
});
</script>

<template>
    <div
        ref="root"
        class="position item absolute select-none"
        :id="`node-${component_id}`"
        :class="{
            selected,
            condition: isCondition,
            action: !isCondition,
            'cursor-pointer': !isDragging,
            'cursor-grabbing': isDragging,
        }"
    >
        <template v-if="'string' in node">
            <span class="w-max whitespace-nowrap break-keep">
                when <span class="badge -mr-1">{{ Condition.getConditionLabel(node) }}</span>
            </span>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.item {
    @apply -translate-x-[50%] -translate-y-[50%] break-keep rounded-full border border-surface-600 bg-surface-700 px-2.5 pb-2 pt-2.5 text-sm text-surface-300;
}

.badge {
    @apply rounded-full bg-surface-600 p-1 px-2;
}

.position {
    left: v-bind("x + 'px'");
    top: v-bind("y + 'px'");
}

.selected {
    @apply border;

    &.condition {
        @apply border-sky-500;
    }

    &.action {
        @apply border-amber-500;
    }
}
</style>
