<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue";
import { State } from "../../../../../types/States";
import { Trigger } from "../../../../../types/Triggers";
import CharacterDropdown from "../../../../CharacterDropdown.vue";
import { Character } from "../../../../../types/Characters";
import { useStatesStore } from "../../../../../stores/states";
import { useCharactersStore } from "../../../../../stores/characters";
import { storeToRefs } from "pinia";
import { set, syncRef, useArrayFilter } from "@vueuse/core";
import StateDropdown from "../../../../StateDropdown.vue";
import { useQuery } from "../../../../../hooks/query";
import { useCondition } from "../../../../../hooks/condition";
import CascadeSelect from "primevue/cascadeselect";
import { Condition } from "../../../../../types/Condition";
import deepUnref from "../../../../../utils/deepUnref";
import Arg from "./Arg.vue";

const props = defineProps<{
    state: State;
    index: number;
    trigger: Trigger;
}>();

const { state, trigger } = toRefs(props);

//#region Character Selection
const character = ref<Character>();
const characterStore = useCharactersStore();
const { characters } = storeToRefs(characterStore);
const available_characters = useArrayFilter(
    characters,
    (c) => stateStore.getStatesFrom(c).length > 0,
);

//#region State Selection
const stateStore = useStatesStore();

const compared_state = ref<State>(state.value);

const state_list = computed(() => {
    const char = character.value;
    const { attached } = props.state;
    if (char) return stateStore.getStatesFrom(char);
    // Get all states that is attached to the same tag or to characters
    return stateStore.getStatesFrom(...(attached instanceof Character ? [attached] : attached));
});
watch(state_list, () => set(compared_state, state.value));

//#region Condition Selection
const getConditionTemplate = (c: Condition): Condition => ({
    name: c.name,
    value: c.value,
    key: c.key,
    args: !!c.args
        ? Object.fromEntries(
              Object.entries(c.args).map(([key, value]) => [key, { type: value.type }]),
          )
        : undefined,
});
const conditions = useCondition(compared_state, character);
const _condition = ref<Condition>();
const condition = ref<Condition>();
syncRef(_condition, condition, {
    deep: true,
    direction: "rtl",
    transform: {
        rtl: (right) => structuredClone(deepUnref(right)),
    },
});
watch(conditions, (v) => {
    // Try to get the first available value of the conditions
    set(condition, v[3].options[0]);
});

//#region Condition Arguments
const args = computed(() => _condition.value?.args);

//#region Trigger Deletion\
const { ask } = useQuery();
const onDelete = async () => {
    const confirmation = await ask({
        title: "Delete Trigger?",
        description: /* html */ `Are you sure you want to delete the trigger? <br /><span class="text-surface-400">You have to press the update button to update the states on ongoing encounters</span>`,
        approveText: "Delete",
    });

    if (confirmation) state.value.triggers.splice(props.index, 1);
};

//#region Condition Validation
const condition_errors = computed(() => {
    const c = _condition.value;
});

//#region Action Validation
</script>

<template>
    <div class="flex rounded-sm bg-surface-700 p-2 py-1">
        <div class="grid flex-grow grid-cols-2 gap-2 rounded-sm bg-surface-700 p-2 py-1">
            <div class="flex flex-col">
                <small>Condition</small>
                <div class="grid grid-cols-2 gap-1">
                    <CharacterDropdown
                        :characters="available_characters"
                        v-model="character"
                        class="w-full"
                        has-own
                    />
                    <StateDropdown class="w-full" :states="state_list" v-model="compared_state" />

                    <CascadeSelect
                        class="col-span-2"
                        v-model="condition"
                        :options="conditions"
                        :optionGroupChildren="['options', 'options']"
                        optionLabel="name"
                        optionGroupLabel="name"
                        placeholder="No Condition Selected"
                    />

                    <template v-if="args && _condition">
                        <Arg
                            v-for="(arg, name) in args"
                            :key="name"
                            :name
                            :arg
                            :state="props.state"
                            :condition="_condition"
                        />
                    </template>
                </div>
            </div>
            <div class="flex flex-col">
                <small>Action</small>
                {{ _condition }}
            </div>
        </div>

        <div class="col-span-2 flex flex-col items-center">
            <Button size="small" text icon="pi pi-times" @click="onDelete" severity="danger" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
small {
    @apply font-semibold text-surface-300;
}
</style>
