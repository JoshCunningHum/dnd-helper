import { RequiredBy } from "@/utils/types";
import { Node } from "./Node";

type ActionValue = ``;

type ActionParams = RequiredBy<Action, "node">;
export class Action {
    node: Node;

    constructor({ node }: ActionParams) {
        this.node = node;
    }
}
