import { Action } from "@/types/Action";
import { State } from "@/types/States";

type ActionFn = (state: State, action: Action, args: Record<string, any>) => void;

const ActionMap = new Map<string, ActionFn>();

export { ActionMap };
