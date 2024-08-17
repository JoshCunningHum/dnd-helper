<script setup lang="ts">
import { set, useArrayFilter } from "@vueuse/core";
import { storeToRefs } from "pinia";
import InputNumber from "primevue/inputnumber";
import SelectButton from "primevue/selectbutton";
import { capitalize, computed, ref, watch } from "vue";
import { useCharactersStore } from "../../../../../stores/characters";
import { useStatesStore } from "../../../../../stores/states";
import { Character } from "../../../../../types/Characters";
import { Condition, ConditionArg, ConditionArgTypes } from "../../../../../types/Condition";
import { State } from "../../../../../types/States";
import CharacterDropdown from "../../../../CharacterDropdown.vue";
import StateDropdown from "../../../../StateDropdown.vue";

const props = defineProps<{
    arg: ConditionArg;
    name: string;
    condition: Condition;
    state: State;
}>();

const type_labels: Record<ConditionArgTypes, string> = {
    "state:boolean": "State",
    "state:number": "State",
    "state:string": "State",
    character: "Character",
    number: "Number",
    state: "State",
    string: "String",
};

const type_options = computed(() =>
    props.arg.type.map((t) => ({ label: type_labels[t], value: t })),
);
const selected_arg_type = ref(type_options.value[0]);
const arg_value = ref<any[]>([]);
const first_arg = computed({ get: () => arg_value.value[0], set: (v) => (arg_value.value[0] = v) });
const second_arg = computed({
    get: () => arg_value.value[1],
    set: (v) => (arg_value.value[1] = v),
});
watch(
    [selected_arg_type, arg_value],
    ([option, values]) => (props.arg.value = [option.value, ...values]),
    {
        deep: true,
        immediate: true,
    },
);

// Check for any changes in the trigger condition name
const reset_args = () => {
    first_arg.value = undefined;
    second_arg.value = undefined;
    character.value = undefined;
    state.value = undefined;
};
const reset = () => {
    set(selected_arg_type, type_options.value[0]);
    reset_args();
};
const condition_name = computed(() => props.condition.name);
watch(selected_arg_type, reset_args);
watch(condition_name, reset);

//#region Character List
const characterStore = useCharactersStore();
const { characters } = storeToRefs(characterStore);
const character_list = useArrayFilter(characters, (c) => stateStore.getStatesFrom(c).length > 0);
const character = ref<Character>();

//#region State List
const stateStore = useStatesStore();
const state_list = computed(() => {
    const char = character.value;
    const { attached } = props.state;
    return stateStore
        .getStatesFrom(...(char ? [char] : attached instanceof Character ? [attached] : attached))
        .filter((s) => {
            const arg_type = selected_arg_type.value.value;
            if (arg_type === "state") return true;
            return ["state:number", "state:boolean", "state:string"][s.data.type] === arg_type;
        });
});
const state = ref<State>();
watch(character, (c) => {
    set(state, state_list.value[0]);
    if (c) set(first_arg, c.id);
});
watch(state, (s) => {
    if (s) set(second_arg, s.id);
});
</script>

<template>
    <div class="col-span-2">
        <small>{{ capitalize(name) }}</small>
        <div
            class="flex"
            :class="{
                'flex-col': selected_arg_type.value.includes('state'),
                'items-center gap-1': !selected_arg_type.value.includes('state'),
            }"
        >
            <SelectButton
                :options="type_options"
                v-model="selected_arg_type"
                option-label="label"
                :class="{
                    'mb-1': selected_arg_type.value.includes('state'),
                }"
                pt:button:class="relative text-sm leading-none inline-flex items-center align-bottom text-center  transition duration-200 cursor-pointer select-none overflow-hidden focus:outline-none focus:outline-offset-0 focus:ring-primary-500 dark:focus:ring-primary-400 focus:z-10 hover:bg-surface-200 dark:hover:bg-surface-600/80 first:rounded-l-md first:rounded-tr-none first:rounded-br-none last:rounded-tl-none last:rounded-bl-none last:rounded-r-md "
            >
                <template #option="{ option }: { option: (typeof type_options)['value'][number] }">
                    <div
                        class="type-option"
                        :class="{
                            selected: option.value === selected_arg_type.value,
                        }"
                    >
                        {{ option.label }}
                    </div>
                </template>
            </SelectButton>
            <template v-if="selected_arg_type.value === 'number'">
                <InputNumber
                    class="flex-grow"
                    placeholder="Input a value here"
                    v-model="first_arg"
                />
            </template>
            <template v-else-if="selected_arg_type.value.includes('state')">
                <CharacterDropdown :characters="character_list" v-model="character" has-own />
                <StateDropdown :states="state_list" v-model="state" />
            </template>
            <template v-else-if="selected_arg_type.value === 'string'">
                <InputText class="flex-grow" placeholder="Input a value here" v-model="first_arg" />
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.type-option {
    @apply bg-surface-0 px-2.5 py-1.5 text-surface-700 dark:bg-surface-900 dark:text-white/80;

    &.selected {
        @apply bg-surface-600;
    }
}

small {
    @apply font-semibold text-surface-300;
}
</style>
