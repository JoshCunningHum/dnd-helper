import { get, set, useMouse, useMousePressed, watchImmediate } from "@vueuse/core";
import { computed, ref, Ref, watch } from "vue";

interface DragOptions {
    onStart: () => void;
    onMove: (x: number, y: number) => void;
}

export const useDrag = (target: Ref<HTMLElement | undefined>, options?: Partial<DragOptions>) => {
    const { onStart, onMove } = options || {};

    const oX = ref(0);
    const oY = ref(0);

    const { x: mX, y: mY } = useMouse();

    const { pressed } = useMousePressed({ target });
    watch(pressed, (v) => {
        if (!v) return;
        set(oX, get(mX));
        set(oY, get(mY));
        if (onStart) onStart();
    });

    const dX = ref(0);
    const dY = ref(0);

    watchImmediate([mX, mY], ([mX, mY]) => {
        if (!pressed.value) return;
        set(dX, mX - oX.value);
        set(dY, mY - oY.value);
        if (onMove) onMove(dX.value, dY.value);
    });

    return {
        dX,
        dY,
        pressed,
    };
};
