import { RequiredBy } from "@/utils/types";
import { Node } from "./Node";
import { Character } from "./Characters";
import { State } from "./States";

type ConditionEncounter = `encounter.${"start" | "end" | "prev" | "next"}`;
type ConditionSession = `session.${"start" | "end" | "shortr" | "longr"}`;
type ConditionCharacter = `character.${Character["id"]}.${
    | "enters"
    | "leave"
    | "turn"
    // custom event
    | `[${string}]`}`;
type ConditionValue = `value.${Character["id"]}.${State["id"]}`;

export type ConditionString =
    | ConditionEncounter
    | ConditionSession
    | ConditionCharacter
    | ConditionValue;

type ConditionArgs = RequiredBy<Condition, "node">;
export class Condition {
    node: Node;
    string: ConditionString;
    args: Record<string, any>;

    constructor({ node, string, args }: ConditionArgs) {
        this.node = node;
        this.string = string || "encounter.start";
        this.args = args || {};
    }
}
