<script setup lang="ts">
import { toRefs } from "vue";
import { State, StateType } from "../../../types/States";

const props = defineProps<{
    state: State;
}>();

const { state } = toRefs(props);
</script>

<template>
    <div class="item h-fit min-w-60 max-w-[320px] flex-grow cursor-pointer">
        <div class="flex items-center justify-between">
            <div class="label flex-grow truncate break-keep">
                {{ state.name }}
                <span class="text-xs" :class="[StateType[state.data.type]]"
                    >[{{ StateType[state.data.type] }}]</span
                >
            </div>
            <div class="text-xs">
                {{ state.triggers.length || "No" }}
                Trigger{{ state.triggers.length === 1 ? "" : "s" }}
            </div>
        </div>
        <div class="flex select-none flex-wrap gap-1">
            <template v-if="Array.isArray(state.attached)">
                <span class="tag truncate break-keep" v-for="tag in state.attached">
                    {{ tag }}
                </span>
            </template>
            <template v-else>
                <span class="tag flex items-center gap-1 truncate break-keep">
                    <div
                        class="size-2 rounded-full"
                        :style="{ background: '#' + state.attached.color }"
                    ></div>
                    <div>
                        {{ state.attached.name }}
                    </div>
                </span>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.item {
    @apply flex flex-col gap-2 rounded bg-surface-700/25 p-2 hover:bg-surface-700/50;

    .label {
        @apply font-semibold;

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

    .tag {
        @apply rounded border border-surface-600 bg-surface-600/50 px-1 py-0.5 text-xs;
    }

    &.selected {
        @apply bg-surface-600/50 hover:bg-surface-600/75;

        .tag {
            @apply border-surface-500 bg-surface-500/50;
        }
    }
}
</style>
