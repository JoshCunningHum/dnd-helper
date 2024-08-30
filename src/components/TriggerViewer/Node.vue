<script setup lang="ts">
import { useDrag } from "@/hooks/drag";
import { useCharactersStore } from "@/stores/characters";
import { Action } from "@/types/Action";
import { Condition } from "@/types/Condition";
import uuid from "@/utils/uuid";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, inject, ref, watch } from "vue";
import CharacterBadge from "../CharacterBadge.vue";
import { State } from "@/types/States";

const props = defineProps<{
    node: Action | Condition;
    index: number;
    state: State;
    selected?: boolean;
}>();

const emits = defineEmits<{
    (e: "delete", node: number): void;
}>();

const isCondition = computed(() => "string" in props.node);
const editing = inject("triggerviewer-editing", ref(false));

//#region Select Node
const component_id = uuid(16);
const selectNode = inject("triggerviewer-selectnode", (_: string) => undefined);

//#region Dragging
const root = ref<InstanceType<typeof HTMLDivElement>>();
const x = computed({
    get: () => props.node.node.x,
    set: (v) => (props.node.node.x = v),
});
const y = computed({
    get: () => props.node.node.y,
    set: (v) => (props.node.node.y = v),
});
const lX = ref(0);
const lY = ref(0);

const onDragStart = () => {
    set(lX, get(x));
    set(lY, get(y));
    if (editing.value) selectNode(props.node.id);
};

const { pressed: isDragging } = useDrag(root, {
    onStart: onDragStart,
    onMove: (dx, dy) => {
        x.value = lX.value + dx;
        y.value = lY.value + dy;
    },
});

//#region Delete Node
const remove = async () => emits("delete", props.index);

//#region Character References
const characterStore = useCharactersStore();
const { characters } = storeToRefs(characterStore);
const getCharacterFromConditionString = (string: string) => {
    const [category, first] = string.split(".");
    return characters.value.find((c) => c.id === Number(first))!;
};
</script>

<template>
    <div
        ref="root"
        class="position item absolute select-none"
        :id="`node-${component_id}`"
        :class="{
            selected,
            condition: isCondition,
            action: !isCondition,
            'cursor-pointer': !isDragging,
            'cursor-grabbing': isDragging,
        }"
    >
        <template v-if="'string' in node">
            <span class="flex items-center gap-2">
                <span>when</span>
                <span class="badge -mr-1.5 flex gap-1.5 whitespace-nowrap break-keep">
                    <!-- Character -->
                    <template v-if="node.string.startsWith('character')">
                        <CharacterBadge
                            v-if="!node.string.includes('.[own].')"
                            :character="getCharacterFromConditionString(node.string)"
                        />
                        <div v-else>Own Character</div>
                        <span>{{ node.string.split(".").at(-1) }}</span>
                    </template>
                    <!-- Default -->
                    <template v-else>
                        {{ Condition.getConditionLabel(node) || node.string }}
                    </template>
                </span>
            </span>
            <div
                class="absolute -bottom-[100%] right-0 space-x-2"
                style="bottom: calc(-100% - 5px)"
                v-if="selected"
            >
                <Button class="pt-1" icon="pi pi-trash" severity="danger" rounded @click="remove" />
                <Button
                    class="pt-1"
                    icon="pi pi-plus"
                    severity="warning"
                    rounded
                    v-tip="'Add connection'"
                />
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.item {
    @apply -translate-x-[50%] -translate-y-[50%] break-keep rounded-full border border-surface-600 bg-surface-700 px-2.5 pb-0.5 pt-1 text-sm text-surface-300;
}

.badge {
    @apply rounded-full bg-surface-600 px-2 pt-1;
}

.position {
    left: v-bind("x + 'px'");
    top: v-bind("y + 'px'");
}

.selected {
    @apply border;

    &.condition {
        @apply border-sky-500;
    }

    &.action {
        @apply border-amber-500;
    }
}
</style>
