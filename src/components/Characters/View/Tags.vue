<script setup lang="ts">
import { ref } from "vue";
import { Character } from "../../../types/Characters";
import Chips from "../../../lib/Query/Chips.vue";
import { onClickOutside, set } from "@vueuse/core";
import { useCharactersStore } from "../../../stores/characters";
import { storeToRefs } from "pinia";

const store = useCharactersStore();
const { tags } = storeToRefs(store);

const props = defineProps<{
    character: Character;
}>();

const isEditing = ref(false);
const startEditing = () => {
    if (isEditing.value) return;
    set(isEditing, true);
};
const endEditing = () => {
    if (!isEditing.value) return;
    set(isEditing, false);
};
const root = ref<InstanceType<typeof HTMLDivElement>>();
onClickOutside(root, endEditing);
</script>

<template>
    <div
        class="ml-2 flex w-fit cursor-pointer select-none flex-wrap gap-1 p-2 hover:bg-surface-900"
        v-tip="{
            text: /* html */ `<span class='font-bold'>Tags</span><br />Click to edit`,
        }"
        @click="startEditing"
        ref="root"
    >
        <template v-if="!isEditing">
            <span class="tag truncate break-keep" v-for="tag in character.tags">
                {{ tag }}
            </span>
        </template>
        <Chips v-else :options="tags" v-model="character.tags" />
    </div>
</template>

<style lang="scss" scoped>
.tag {
    @apply rounded border border-surface-600 bg-surface-600/50 px-1.5 py-1 text-sm;
}
</style>
