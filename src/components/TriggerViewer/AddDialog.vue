<script setup lang="ts">
import { toRefs } from "vue";
import span from "@/utils/vhtmls/span";

const props = defineProps<{
    x: number;
    y: number;
}>();
const { x, y } = toRefs(props);

const emits = defineEmits<{
    (e: "add", type: "Condition" | "Action"): void;
    (e: "persistPopup"): void;
}>();

const persist = () => emits("persistPopup");
const add = (type: "Condition" | "Action") => emits("add", type);
</script>

<template>
    <div
        class="add-popup absolute flex flex-col items-center"
        @hover="persist"
        @mousemove="persist"
    >
        <div
            class="flex size-6 -translate-y-6 cursor-crosshair items-center justify-center rounded-full border border-surface-300 text-surface-300"
        >
            <i class="pi pi-plus mr-0.5 mt-0.5 text-xs" />
        </div>
        <ButtonGroup class="bt-group">
            <Button
                @click="() => add('Condition')"
                severity="info"
                v-tip="
                    `Add a ${span('condition', { class: 'text-blue-500' })} in the current position`
                "
                >Condition</Button
            >
            <Button
                @click="() => add('Action')"
                severity="warning"
                v-tip="
                    `Add an ${span('action', { class: 'text-amber-500' })} in the current position`
                "
                >Action</Button
            >
        </ButtonGroup>
    </div>
</template>

<style lang="scss" scoped>
.container {
    left: v-bind("x + 'px'");
    top: v-bind("y + 'px'");
    transform: translate(-50%, 10px);
}
</style>
