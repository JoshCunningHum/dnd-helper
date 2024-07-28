<script setup lang="ts">
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Editor } from "@tiptap/core";
import OverlayPanel from "primevue/overlaypanel";
import { ref, toRefs } from "vue";
import { useTiptapHelpers } from "../../hooks/tiptapHelpers";
import File from "../Query/File.vue";
import { get } from "@vueuse/core";

type ImageAttributes = {
    src: string;
    alt?: string;
    title?: string;
    width?: string | undefined;
    height?: string | undefined;
    style?: string;
};

const props = defineProps<{
    editor: Editor;
}>();

const { editor } = toRefs(props);
const { ecf } = useTiptapHelpers(editor);

// #region Image Input Panel
const panel = ref<OverlayPanel>();
const imageb64 = ref<string>();

const insert = () => {
    const b64 = get(imageb64);
    if (!b64) return;
    const attrs: ImageAttributes = {
        src: b64,
        style: `width: 200px;`,
    };
    ecf((f) => f.setImage(attrs));
    panel.value?.hide();
};
</script>

<template>
    <Button
        text
        severity="contrast"
        v-tip="`Image`"
        @click="panel?.show($event)"
    >
        <template #icon>
            <FontAwesomeIcon :icon="faImage" />
        </template>
    </Button>
    <OverlayPanel ref="panel">
        <div class="flex w-72 flex-col gap-2">
            <small>Choose an image</small>
            <File accept="image/*" v-model="imageb64" />
            <Button :disabled="!imageb64" @click="insert">Insert</Button>
        </div>
    </OverlayPanel>
</template>

<style lang="scss" scoped></style>
