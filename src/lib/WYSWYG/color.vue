<script setup lang="ts">
import { get, set } from "@vueuse/core";
import OverlayPanel from "primevue/overlaypanel";
import { ref } from "vue";
import darker from "../../utils/darker";

const props = withDefaults(
    defineProps<{
        tooltip?: string;
        default?: string;
    }>(),
    {
        default: "initial",
    },
);
const color = defineModel<string>({ default: "initial" });
const slots = defineSlots<{
    icon(props: {}): any;
}>();
const emits = defineEmits<{
    (e: "set", color: string): void;
}>();

//#region Predefined Colors
const colors: string[][] = [
    ["#79F2C0", "#79E2F2", "#B3D4FF", "#C0B6F2", "#FABCAC", "#D7C77D", "#EBECF0"],
    [
        darker("#79F2C0", 0.5),
        darker("#79E2F2", 0.5),
        darker("#AED1FF", 0.5),
        darker("#C0B6F2", 0.5),
        darker("#FABCAC", 0.5),
        darker("#FBE280", 0.5),
        darker("#EBECF0", 0.5),
    ],
];

//#region Color
const c_panel = ref<OverlayPanel>();

const setColor = (c: string) => {
    set(color, c === get(color) ? props.default : c);
    emits("set", color.value);
};
</script>

<template>
    <Button
        text
        severity="contrast"
        v-tip="props.tooltip"
        @click="(e) => c_panel?.show(e)"
        :style="`color: ${color === props.default ? 'white' : color}`"
    >
        <template v-if="!!slots.icon" #icon>
            <slot name="icon"></slot>
        </template>
    </Button>
    <OverlayPanel
        ref="c_panel"
        :pt="{
            content: () => ({
                class: 'p-2',
            }),
        }"
    >
        <div class="flex flex-col gap-2">
            <div v-for="(cg, i) in colors" :key="i" class="flex gap-2">
                <div
                    v-for="(c, i) in cg"
                    :key="i"
                    class="h-3 w-5 cursor-pointer rounded-sm"
                    :class="{
                        'outline-double': c === color,
                    }"
                    :style="`background: ${c}`"
                    @click="() => setColor(c)"
                ></div>
            </div>
        </div>
    </OverlayPanel>
</template>

<style lang="scss" scoped></style>
