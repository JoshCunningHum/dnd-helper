<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCharactersStore } from "../stores/characters";
import { Character } from "../types/Characters";
import { set } from "@vueuse/core";
import Dropdown from "primevue/dropdown";

const model = defineModel<Character>();
const props = defineProps<{
    characters?: Character[];
    hasOwn?: boolean;
}>();

const store = useCharactersStore();

const character_list = ref<Character[]>([]);
onMounted(() => set(character_list, props.characters || store.characters));
</script>

<template>
    <Dropdown v-model="model" :options="character_list" option-label="name" :show-clear="hasOwn">
        <template #option="{ index, option }: { index: number; option: Character }">
            <div class="flex items-center gap-2">
                <div class="size-2 rounded-full" :style="{ background: '#' + option.color }"></div>
                <div class="truncate">
                    {{ option.name }}
                </div>
            </div>
        </template>
        <template #value="{ value }: { placeholder: string; value: Character }">
            <div class="flex items-center gap-2" v-if="!!model">
                <div class="size-2 rounded-full" :style="{ background: '#' + value.color }"></div>
                <div class="truncate">
                    {{ value.name }}
                </div>
            </div>
            <div v-else>
                <div>Own Character</div>
            </div>
        </template>
    </Dropdown>
</template>

<style lang="scss" scoped></style>
