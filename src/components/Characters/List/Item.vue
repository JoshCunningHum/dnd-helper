<script setup lang="ts">
import { useObjectUrl } from "@vueuse/core";
import Avatar from "primevue/avatar";
import { computed, toRefs } from "vue";
import { Character } from "../../../types/Characters";

const props = defineProps<{
    char: Character;
}>();

const { char } = toRefs(props);
const color = computed(() => char.value.color);

const imgurl = useObjectUrl(() => char.value.image);
const label = computed(() =>
    char.value.name
        .split(" ")
        .map(([c]) => c)
        .filter((c) => !!c && /^[a-z]/i.test(c))
        .slice(0, 2)
        .join("")
        .toUpperCase(),
);

const tooltip = computed(() => {
    const d = char.value.description;
    return d === "<p></p>" ? undefined : d;
});
</script>

<template>
    <div class="item min-w-0 cursor-pointer" v-tip="tooltip">
        <Avatar
            :image="imgurl"
            :label="imgurl ? undefined : label"
            shape="circle"
            class="avatar"
        />
        <div class="flex w-full min-w-0 flex-grow flex-col">
            <div class="label truncate break-keep">
                {{ char.name }}
            </div>
            <div class="flex select-none flex-wrap gap-1">
                <span class="tag truncate break-keep" v-for="tag in char.tags">
                    {{ tag }}
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.item {
    @apply flex gap-2 rounded bg-surface-700/25 p-2 hover:bg-surface-700/50;

    .label {
        @apply font-semibold;
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

.avatar {
    border-width: 2px;
    border-color: v-bind("'#'+color");
}
</style>
