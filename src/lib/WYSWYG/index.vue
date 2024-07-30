<script setup lang="ts">
//#region TipTap Imports
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { Level } from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { ChainedCommands, EditorContent, useEditor } from "@tiptap/vue-3";
import ImageResize from "tiptap-extension-resize-image";
//#endregion

//#region Vue Imports
import { get, set, useArrayMap } from "@vueuse/core";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import { capitalize, computed, onBeforeUnmount } from "vue";
import ColorSelector from "./color.vue";
import LinkFeature from "./LinkFeature.vue";
//#endregion

//#region FontAwesome Icons
import {
    faAlignCenter,
    faAlignJustify,
    faAlignLeft,
    faAlignRight,
    faBold,
    faFill,
    faFillDrip,
    faItalic,
    faListOl,
    faListUl,
    faSort,
    faTextSlash,
    faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import CodeFeature from "./CodeFeature.vue";
import ImageFeature from "./ImageFeature.vue";
// #endregion

//#region Instantiation
const model = defineModel<string>({ default: "" });
const props = defineProps<{
    placeholder?: string;
}>();

const editor = useEditor({
    content: model.value,
    onUpdate: ({ editor }) => set(model, editor?.getHTML()),
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: props.placeholder || "Write Something...",
        }),
        FontFamily,
        TextStyle,
        Underline,
        Color,
        Highlight.configure({
            multicolor: true,
        }),
        TextAlign.configure({
            types: ["heading", "paragraph"],
        }),
        Link.configure({
            autolink: true,
            linkOnPaste: true,
            openOnClick: false,
        }),
        ImageResize.configure({
            allowBase64: true,
        }),
    ],
});
onBeforeUnmount(() => editor.value?.destroy());
//#endregion

//#region Tiptap Helpers
const ed = () => get(editor);
const foc = (callback: (f: ChainedCommands) => ChainedCommands) => {
    const editorValue = ed();
    if (!editorValue) return;
    const chain = editorValue.chain().focus();
    callback(chain).run();
};
//#endregion

//#region Heading
const headings = [
    `Heading 1`,
    `Heading 2`,
    `Heading 3`,
    `Subheading 1`,
    `Subheading 2`,
    `Subheading 3`,
    `Paragraph`,
];
const headinglvl = computed({
    get: () =>
        (headings.findIndex((_, i) => ed()?.isActive("heading", { level: i + 1 })) + 1) as
            | Level
            | 0,
    set: (v: Level | 0) => {
        if (v === 0) foc((f) => f.setHeading({ level: 1 }).toggleHeading({ level: 1 }));
        else foc((f) => f.setHeading({ level: v }));
    },
});

const headingOptions = useArrayMap(
    () => headings,
    (h, i) => ({ label: h, value: i > 5 ? 0 : i + 1 }),
);
//#endregion

//#region Font Family
const fonts = [
    {
        label: `DM Sans`,
        value: `DM Sans Variable`,
    },
    {
        label: `Martian Mono`,
        value: `Martian Mono Variable`,
    },
    {
        label: `Comic Sans`,
        value: `Comic Sans MS, Comic Sans`,
    },
];
const font = computed({
    get: () => fonts.find((f) => ed()?.isActive("textStyle", { fontFamily: f.value })) || fonts[0],
    set: (f) => foc((_) => _.setFontFamily(f.value)),
});
//#endregion

//#region Bold, Italic, and Underlined
const bold = computed({
    get: () => ed()?.isActive("bold"),
    set: (_) => foc((_) => _.toggleBold()),
});
const italic = computed({
    get: () => ed()?.isActive("italic"),
    set: (_) => foc((_) => _.toggleItalic()),
});
const underlined = computed({
    get: () => ed()?.isActive(`underline`),
    set: (_) => foc((_) => _.toggleUnderline()),
});
//#endregion

//#region Text Colors
const text_fg = computed({
    get: () => (editor.value?.getAttributes("textStyle").color as string) || "white",
    set: (v) => foc((f) => f.setColor(v)),
});
const text_bg = computed({
    get: () => (editor.value?.getAttributes("highlight").color as string) || "transparent",
    set: (v) => foc((f) => f.setHighlight({ color: v })),
});
//#endregion

//#region Lists
const toggleUL = () => foc((f) => f.toggleBulletList());
const toggleOL = () => foc((f) => f.toggleOrderedList());
//#endregion

//#region Text Aligns
const align_options = ["left", "center", "right", "justify"] as const;
const align = computed({
    get: () =>
        Math.max(
            align_options.findIndex((o) => ed()?.isActive({ textAlign: o })),
            0,
        ),
    set: (v) => foc((f) => f.setTextAlign(align_options[v % 4])),
});
//#endregion

//#region Format Reset
const resetFormat = () => foc((f) => f.clearNodes().unsetAllMarks());
//#endregion
</script>

<template>
    <div class="root" v-if="editor">
        <div class="toolbar-wrapper max-w-full overflow-x-auto whitespace-nowrap">
            <div class="toolbar inline-flex min-w-min flex-nowrap items-center gap-2">
                <!-- #region Heading -->
                <Dropdown
                    :options="headingOptions"
                    v-model="headinglvl"
                    option-label="label"
                    option-value="value"
                    class="mr-2 w-36"
                    v-tip="{
                        text: 'Heading',
                        hotkey: {
                            'Heading 1': 'CTRL + ALT + 1',
                            'Heading 2': 'CTRL + ALT + 2',
                            'Heading 3': 'CTRL + ALT + 3',
                            'SubHeading 1': 'CTRL + ALT + 4',
                            'SubHeading 2': 'CTRL + ALT + 5',
                            'SubHeading 3': 'CTRL + ALT + 6',
                        },
                    }"
                >
                    <template #option="{ option }">
                        <component :is="option.value > 0 ? `h${option.value}` : 'span'">{{
                            option.label
                        }}</component>
                    </template>
                    <template #dropdownicon>
                        <FontAwesomeIcon :icon="faSort" />
                    </template>
                </Dropdown>
                <!-- #endregion -->
                <!-- #region Font -->
                <Dropdown
                    :options="fonts"
                    v-model="font"
                    option-label="label"
                    class="w-40"
                    v-tip="`Font`"
                >
                    <template #option="{ option }">
                        <span :style="`font-family: ${option.value}`">{{ option.label }}</span>
                    </template>
                    <template #dropdownicon>
                        <FontAwesomeIcon :icon="faSort" />
                    </template>
                </Dropdown>
                <!-- #endregion -->
                <!-- #region Text Styles -->
                <Divider layout="vertical" />
                <Button
                    v-tip="{ text: 'Bold', hotkey: 'CTRL + B' }"
                    text
                    :severity="bold ? 'success' : 'contrast'"
                    @click="bold = !bold"
                >
                    <template #icon>
                        <FontAwesomeIcon :icon="faBold" />
                    </template>
                </Button>
                <Button
                    text
                    v-tip="{ text: 'Italic', hotkey: 'CTRL + I' }"
                    :severity="italic ? 'success' : 'contrast'"
                    @click="italic = !italic"
                >
                    <template #icon>
                        <FontAwesomeIcon :icon="faItalic" />
                    </template>
                </Button>
                <Button
                    text
                    v-tip="{ text: 'Underline', hotkey: 'CTRL + U' }"
                    :severity="underlined ? 'success' : 'contrast'"
                    @click="underlined = !underlined"
                >
                    <template #icon>
                        <FontAwesomeIcon :icon="faUnderline" />
                    </template>
                </Button>
                <!-- #endregion -->
                <!-- #region Text Color -->
                <Divider layout="vertical" />
                <ColorSelector tooltip="Text Color" default="white" v-model="text_fg">
                    <template #icon>
                        <FontAwesomeIcon :icon="faFillDrip" />
                    </template>
                </ColorSelector>

                <ColorSelector tooltip="Text Background" v-model="text_bg" default="transparent">
                    <template #icon>
                        <FontAwesomeIcon :icon="faFill" />
                    </template>
                </ColorSelector>
                <!-- #endregion -->
                <!-- #region Text Align & Order -->
                <Divider layout="vertical" />
                <Button text severity="contrast" @click="toggleOL" v-tip="`Ordered List`">
                    <template #icon>
                        <FontAwesomeIcon :icon="faListOl" />
                    </template>
                </Button>
                <Button text severity="contrast" @click="toggleUL" v-tip="`Unordered List`">
                    <template #icon>
                        <FontAwesomeIcon :icon="faListUl" />
                    </template>
                </Button>
                <Button
                    text
                    severity="contrast"
                    @click="align++"
                    v-tip="{
                        text: `Text Align - ${capitalize(align_options[align])}`,
                        hotkey: {
                            Left: 'CTRL + SHIFT + L',
                            Center: 'CTRL + SHIFT + E',
                            Right: 'CTRL + SHIFT + R',
                            Justify: 'CTRL + SHIFT + J',
                        },
                    }"
                >
                    <template #icon>
                        <FontAwesomeIcon
                            :icon="
                                [faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify][align]
                            "
                        />
                    </template>
                </Button>
                <!-- #endregion -->
                <!-- #region Miscelleanous -->
                <Divider layout="vertical" />
                <LinkFeature :editor="editor" />
                <ImageFeature :editor="editor" />
                <CodeFeature :editor="editor" />
                <!-- #endregion -->
                <!-- #region Reset Styles -->
                <Divider layout="vertical" />
                <Button text severity="contrast" v-tip="`Format Reset`" @click="resetFormat">
                    <template #icon>
                        <FontAwesomeIcon :icon="faTextSlash" />
                    </template>
                </Button>
                <!-- #endregion -->
            </div>
        </div>
        <EditorContent
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            :editable="true"
            class="max-h-max resize-y overflow-y-auto px-3 py-2 !outline-none"
            :editor="editor"
        />
    </div>
</template>

<style lang="scss">
.tiptap {
    /* Placeholder (at the top) */
    p.is-editor-empty:first-child::before {
        color: rgb(var(--surface-400));
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
    }

    ol,
    ul {
        @apply ml-4 marker:w-fit marker:text-sm;
    }

    ol {
        @apply list-decimal;
    }
    ul {
        @apply list-disc;
    }

    a {
        @apply cursor-pointer text-blue-500 underline;
    }

    pre {
        background: rgb(var(--surface-900));
        border-radius: 0.5rem;
        color: rgb(var(--surface-200));
        font-family: "JetBrainsMono", monospace;
        margin: 1rem 0;
        padding: 0.5rem 0.75rem;

        code {
            background: none;
            color: inherit;
            font-size: 0.8rem;
            padding: 0;
        }
    }
}

/* Heading styles */
h1,
.h1 {
    @apply text-5xl font-bold;
}
h2,
.h2 {
    @apply text-4xl font-bold;
}
h3,
.h3 {
    @apply text-3xl font-bold;
}
h4,
.h4 {
    @apply text-2xl font-bold;
}
h5,
.h5 {
    @apply text-xl font-bold;
}
h6,
.h6 {
    @apply text-lg font-bold;
}
/* Other Formatting */
a {
    @apply cursor-pointer text-blue-500 underline;
}

ol,
ul {
    @apply ml-4 marker:w-fit marker:text-sm;
}

ol {
    @apply list-decimal;
}
ul {
    @apply list-disc;
}
</style>

<style lang="scss" scoped>
.root {
    @apply rounded border-2 border-surface-700 bg-surface-700;
}

.toolbar-wrapper {
    @apply bg-surface-800 px-2 pb-1.5 pt-1;
}
</style>
