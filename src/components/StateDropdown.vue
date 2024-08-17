<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useStatesStore } from "../stores/states";
import { State, StateType } from "../types/States";
import { set } from "@vueuse/core";

const model = defineModel<State>();
const props = defineProps<{
    states?: State[];
}>();

const stateStore = useStatesStore();
const state_list = ref<State[]>([]);
watch(
    () => props.states,
    (v) => !!v && set(state_list, props.states),
);
onMounted(() => set(state_list, props.states || stateStore.states));
</script>

<template>
    <Dropdown v-model="model" :options="state_list" option-label="name">
        <template #option="{ index, option }: { index: number; option: State }">
            <div class="lbl text flex items-center gap-2">
                <div class="truncate">
                    {{ option.name }}
                </div>
                <div :class="[StateType[option.data.type]]">
                    [{{ StateType[option.data.type] }}]
                </div>
            </div>
        </template>
        <template #value="{ value }: { placeholder: string; value: State }">
            <div class="lbl flex items-center gap-2" v-if="!!model">
                <div class="truncate">
                    {{ value.name }}
                </div>
                <div :class="[StateType[value.data.type]]">[{{ StateType[value.data.type] }}]</div>
            </div>
            <div v-else>
                <div class="text-surface-400">No State Selected</div>
            </div>
        </template>
    </Dropdown>
</template>

<style lang="scss" scoped>
.lbl {
    .Number {
        @apply text-green-500;
    }

    .String {
        @apply text-amber-500;
    }

    .Boolean {
        @apply text-cyan-500;
    }
}
</style>
