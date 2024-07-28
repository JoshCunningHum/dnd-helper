import { Editor } from "@tiptap/core";
import { ChainedCommands } from "@tiptap/vue-3";
import { computed, isRef, MaybeRef } from "vue";

export const useTiptapHelpers = (editor?: MaybeRef<Editor>) => {
    const ecf = (callback: (f: ChainedCommands) => ChainedCommands) => {
        const e = isRef(editor) ? editor.value : editor;
        if (!e) return;
        const chain = e.chain().focus();
        callback(chain).run();
    };

    const selectedtxt = computed(() => {
        const e = isRef(editor) ? editor.value : editor;
        if (!e) return;
        const { state } = e;
        const {
            selection: { from, to },
        } = state;
        return state.doc.textBetween(from, to);
    });

    return {
        ecf,
        selectedtxt,
    };
};
