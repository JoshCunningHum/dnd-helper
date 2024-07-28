Button
<script setup lang="ts">
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Editor } from "@tiptap/core";
import { EditorState } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { BubbleMenu } from "@tiptap/vue-3";
import { set, useElementBounding } from "@vueuse/core";
import { computed, ref } from "vue";
import { useTiptapHelpers } from "../../hooks/tiptapHelpers";

const props = defineProps<{
    editor: Editor;
}>();

const editor = computed(() => props.editor);
const { ecf, selectedtxt } = useTiptapHelpers(editor);

//#region Defines if BubbleMenu should show
const shouldshow = ({
    oldState,
    state,
}: {
    editor: Editor;
    view: EditorView;
    state: EditorState;
    oldState?: EditorState;
    from: number;
    to: number;
}) => {
    // Check if the selection has changed
    const selectionChanged = !oldState?.selection.eq(state.selection);

    // Get the marks at the current selection
    const { empty, $from, $to } = state.selection;
    const mark = $from.marks().find((mark) => mark.type.name === "link");
    const isLink = !!mark;

    // Get the text
    let txt = "";
    state.doc.nodesBetween($from.pos, $to.pos, (node) => {
        if (node.isText) txt += node.text;
    });

    // Show the menu if the selection is a link, or if it changed and became a link
    const shouldOpen = isLink && (selectionChanged || !empty) && !!txt;

    // Get Link Values
    if (shouldOpen) {
        const { href } = mark.attrs;
        set(link_href, href);
        set(link_txt, txt);
        updatePosition();
    }
    return shouldOpen;
};

//#region Link Values
const link_txt = ref<string>("");
const link_href = ref<string>("");

const updateValues = () => {
    ecf((f) =>
        f
            .extendMarkRange("link")
            .setLink({ href: link_href.value })
            .insertContent(link_txt.value),
    );
};

// When clicking the link button
const setLink = () => {
    const txt = selectedtxt.value || "Link Text";
    const href = `<< link here >>`;
    set(link_href, href);
    set(link_txt, txt);
    updateValues();
};

const gotolink = () => window.open(link_href.value);

//#region Menu
const container = ref<InstanceType<typeof HTMLDivElement>>();
const {
    top,
    left,
    width,
    update: updatePosition,
} = useElementBounding(container, {
    windowResize: true,
    windowScroll: true,
});

const ml = computed(() => {
    const [{ value: t }, { value: l }] = [top, left];
    if (t === 0 && l === 0) return 0; // The element is hidden
    return width.value / 2;
});
</script>

<template>
    <Button text severity="contrast" v-tip="`Link`" @click="setLink">
        <template #icon>
            <FontAwesomeIcon :icon="faLink" />
        </template>
    </Button>
    <BubbleMenu
        ref="container"
        plugin-key="links"
        :should-show="shouldshow"
        :editor="editor"
        v-if="!!editor"
        class="relative"
    >
        <form
            @submit.prevent="updateValues"
            ref="menu"
            :style="`margin-left: ${ml}px`"
            class="bubble-menu absolute mt-[30px] min-w-80 rounded border border-surface-600 bg-surface-800 p-2"
        >
            <small>Link Location</small>
            <InputGroup>
                <InputText v-model="link_href" />
                <Button
                    icon="pi pi-external-link"
                    severity="secondary"
                    link
                    @click="gotolink"
                />
            </InputGroup>
            <small>Displayed Text</small>
            <InputText v-model="link_txt" />
            <div class="flex justify-end">
                <Button
                    type="submit"
                    size="small"
                    class="mt-2"
                    @click="updateValues"
                    >Set Link</Button
                >
            </div>
        </form>
    </BubbleMenu>
</template>
