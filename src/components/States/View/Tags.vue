<script setup lang="ts">
import { onClickOutside, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import Chips from "../../../lib/Query/Chips.vue";
import { useCharactersStore } from "../../../stores/characters";
import { State } from "../../../types/States";
import Dropdown from "primevue/dropdown";
import { Character } from "../../../types/Characters";

const store = useCharactersStore();
const { tags } = storeToRefs(store);

const props = defineProps<{
    state: State;
}>();

const isEditing = ref(false);
const startEditing = () => {
    if (isEditing.value) return;
    set(isEditing, true);
};
const dropdownClicked = ref(false);
const endEditing = () => {
    if (!isEditing.value) return;
    // Check if it is a character type
    setTimeout(
        () => {
            set(dropdownClicked.value ? dropdownClicked : isEditing, false);
        },
        Array.isArray(props.state.attached) ? 0 : 50,
    );
};
const root = ref<InstanceType<typeof HTMLDivElement>>();
onClickOutside(root, endEditing);

//#region Character Options
const characterStore = useCharactersStore();
const { characters } = storeToRefs(characterStore);
</script>

<template>
    <small class="ml-2 select-none text-surface-400"> Attaches To </small>
    <div
        class="ml-2 flex w-fit cursor-pointer select-none flex-wrap gap-1 hover:bg-surface-900"
        v-tip="{
            text: /* html */ `<span class='font-bold'>Attached To</span><br />Click to edit`,
        }"
        @click="startEditing"
        ref="root"
    >
        <template v-if="isEditing">
            <Chips :options="tags" v-if="Array.isArray(state.attached)" v-model="state.attached" />
            <Dropdown
                v-else
                v-model="state.attached"
                :options="characters"
                option-label="name"
                @change="() => (dropdownClicked = true)"
            >
                <template #option="{ index, option }: { index: number; option: Character }">
                    <div class="flex items-center gap-2">
                        <div
                            class="size-2 rounded-full"
                            :style="{ background: '#' + option.color }"
                        ></div>
                        <div>
                            {{ option.name }}
                        </div>
                    </div>
                </template>
                <template #value="{ value }: { placeholder: string; value: Character }">
                    <div class="flex items-center gap-2">
                        <div
                            class="size-2 rounded-full"
                            :style="{ background: '#' + value.color }"
                        ></div>
                        <div>
                            {{ value.name }}
                        </div>
                    </div>
                </template>
            </Dropdown>
        </template>
        <template v-else>
            <template v-if="Array.isArray(state.attached)">
                <span class="tag truncate break-keep" v-for="tag in state.attached">
                    {{ tag }}
                </span>
            </template>
            <template v-else>
                <div class="tag flex items-center gap-2">
                    <div
                        class="size-2 rounded-full"
                        :style="{ background: '#' + state.attached.color }"
                    ></div>
                    <div>
                        {{ state.attached.name }}
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.tag {
    @apply rounded border border-surface-600 bg-surface-600/50 px-1.5 py-1 text-sm;
}
</style>
