import { RequiredBy } from "@/utils/types";
import { Node } from "./Node";
import uuid from "@/utils/uuid";

type ActionValue = ``;

type ActionParams = RequiredBy<Action, "node">;
export class Action {
    id: string;
    node: Node;

    constructor({ id, node }: ActionParams) {
        this.id = id || uuid(14);
        this.node = node;
    }
}
