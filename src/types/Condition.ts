import { RequiredBy } from "@/utils/types";
import { Node } from "./Node";
import { Character } from "./Characters";
import { State } from "./States";
import uuid from "@/utils/uuid";

type ConditionEncounter = `encounter.${"start" | "end" | "prev" | "next"}`;
type ConditionSession = `session.${"start" | "end" | "shortr" | "longr"}`;
type ConditionCharacter = `character.${Character["id"] | "[own]"}.${
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
    id: string;
    node: Node;
    string: ConditionString;
    args: Record<string, any>;

    static getConditionLabel(condition: Condition) {
        const { string } = condition;
        const [type, first, second] = string.split(".");

        switch (type) {
            case "encounter":
                return `Encounter ${first === "prev" ? "previous turn" : first === "next" ? "next turn" : `${first}s`}`;
            case "session":
                return `${first === "shortr" ? "Short Rest" : first === "longr" ? "Long Rest" : `Session ${first}`}`;
            case "character":
                break;
            case "value":
                break;
        }
        return "";
    }

    constructor({ id, node, string, args }: ConditionArgs) {
        this.id = id || uuid(14);
        this.node = node;
        this.string = string || "encounter.start";
        this.args = args || {};
    }
}
