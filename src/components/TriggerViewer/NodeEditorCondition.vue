<script setup lang="ts">
import { getConditionList, getConditionFromString, ConditionValue } from "@/content/conditions";
import { Condition } from "@/types/Condition";
import { computed, onMounted, ref, toRefs } from "vue";
import Fill from "../Fill.vue";
import CascadeSelect from "primevue/cascadeselect";
import { useArrayFilter, watchImmediate } from "@vueuse/core";
import { State } from "@/types/States";
import { useCharactersStore } from "@/stores/characters";
import { storeToRefs } from "pinia";
import CharacterBadge from "../CharacterBadge.vue";
import { Character } from "@/types/Characters";

const props = defineProps<{
    condition: Condition;
    state: State;
}>();

const { condition } = toRefs(props);

const characterStore = useCharactersStore();
const { characters } = storeToRefs(characterStore);

//#region Track Changes
const hasChanges = ref(false);

//#region Condition Cascade List
const options = computed(() => getConditionList(props.state));
const condition_value = ref<ConditionValue>();
const condition_value_string = computed(() => {
    const cv = condition_value.value;
    if (!cv) return undefined;
    return cv.condition_string;
});

watchImmediate(condition, (node) => {
    const initial_condition_value = getConditionFromString(node.string, props.state);
    if (initial_condition_value) condition_value.value = initial_condition_value;
});

//#region Schema
const schema = computed(() => {
    const cv = condition_value.value;
    if (!cv) return undefined;
    if (!cv.schema) return undefined;
    return cv.schema();
});

//#region Saving
const save = () => {
    // TODO: Add check for argument schema validation
    const cvs = condition_value_string.value;
    if (!cvs) return;

    condition.value.string = cvs;
};

//#region Targetted Characters
const is_targeting_own_character = computed(() =>
    condition_value_string.value?.includes(".[own]."),
);
const targetted_characters = useArrayFilter(characters, (char) => props.state.isAttached(char));
const character_from_condition_string = computed(() => {
    const str = condition_value_string.value;
    if (!str) return undefined;
    return Character.fromConditionString(str);
});
</script>

<template>
    <Fill flex-col>
        <Fill flex-col>
            <CascadeSelect
                :options
                v-model="condition_value"
                option-label="label"
                option-group-label="label"
                @change="hasChanges = true"
                :option-group-children="['options', 'options', 'options']"
                placeholder="Select a condition"
                class="min-w-64"
                :pt="{
                    list: () => ({
                        class: 'border border-surface-600 rounded-b',
                    }),
                    sublist: () => ({
                        class: [
                            'border border-surface-600 rounded-b',
                            'static sm:absolute',
                            'z-10',
                            'bg-surface-0 dark:bg-surface-700',
                            'w-full sm:min-w-44',
                        ],
                    }),
                }"
            >
                <template #value>
                    <template v-if="character_from_condition_string">
                        <CharacterBadge :character="character_from_condition_string" />
                        <span class="pl-1">{{ condition_value_string?.split(".").at(-1) }}</span>
                    </template>
                    <template v-else>
                        {{ condition_value?.label }}
                    </template>
                </template>
            </CascadeSelect>
            <div v-if="is_targeting_own_character">
                <small class="label">Targetted Characters</small>
                <div class="pl-4" v-for="char in targetted_characters" :key="char.id">
                    <CharacterBadge :character="char" class="text-sm" />
                </div>
            </div>
        </Fill>

        <div class="flex justify-end" v-if="hasChanges">
            <Button @click="save"> Save </Button>
        </div>
    </Fill>
</template>

<style lang="scss" scoped></style>
