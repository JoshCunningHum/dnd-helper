<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { State } from "../../../types/States";
import { toRefs, watch } from "vue";
import Name from "./Name.vue";
import Operations from "./Operations.vue";
import Tags from "./Tags.vue";

const props = defineProps<{
    state: State;
}>();

const { state } = toRefs(props);

const emits = defineEmits<{
    (e: "next"): void;
    (e: "prev"): void;
}>();

//#region Mutation Listener (for updating)
const update = useDebounceFn(() => state.value.update(), 250);
watch(state, update, { deep: true });
</script>

<template>
    <div class="flex flex-col p-2">
        <div class="flex w-full">
            <Operations
                class="mr-4"
                @next="() => emits('next')"
                @prev="() => emits('prev')"
                :state="state"
            />
            <div class="flex flex-col">
                <Name :state="state" />
                <Tags :state="state" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
