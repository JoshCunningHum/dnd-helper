<script setup lang="ts">
import { Editor } from "@tiptap/core";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, toRefs } from "vue";
import { useTiptapHelpers } from "../../hooks/tiptapHelpers";

const props = defineProps<{
    editor: Editor;
}>();

const { editor } = toRefs(props);
const { ecf } = useTiptapHelpers(editor);

const isCodeBlock = computed(() => editor.value.isActive("codeBlock"));
const onClick = () => ecf((f) => f.toggleCodeBlock());
</script>

<template>
    <Button
        @click="onClick"
        text
        :severity="isCodeBlock ? 'success' : 'contrast'"
        v-tip="`Code Block`"
    >
        <template #icon>
            <FontAwesomeIcon :icon="faCode" />
        </template>
    </Button>
</template>

<style lang="scss" scoped></style>
