import { State } from "../types/States";
import { Trigger } from "../types/Triggers";
import { isRef, MaybeRef, ref } from "vue";

export const useTriggers = (state: MaybeRef<State>) => {
    // All triggers defined in here
    if (!isRef(state)) state = ref(state);
};
