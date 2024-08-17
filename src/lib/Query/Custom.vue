<script setup lang="ts" generic="T">
import { set, whenever } from "@vueuse/core";
import { ref } from "vue";
import { QuerySchemaMeta } from "./types";

const model = defineModel<T>({ required: true });

const props = defineProps<{
    mount: Extract<QuerySchemaMeta, { type: "component" }>["mount"];
}>();
const container = ref<InstanceType<typeof HTMLDivElement>>();

whenever(container, (c) => {
    props.mount(c, model.value, (v) => set(model, v));
});
</script>

<template>
    <div ref="container"></div>
</template>

<style lang="scss" scoped></style>
