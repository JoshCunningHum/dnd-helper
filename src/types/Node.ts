import { RequiredBy } from "../utils/types";
import uuid from "../utils/uuid";

type NodeParams = RequiredBy<Node, "x" | "y">;
export class Node {
    id: string;
    x: number = 0;
    y: number = 0;
    activation_type: "OR" | "AND";
    text?: string;

    constructor({ x, y, activation_type, text }: NodeParams) {
        this.id = uuid(16);
        this.x = x;
        this.y = y;

        this.text = text;
        this.activation_type = activation_type || "OR"; // At least 1 true by default
    }

    outs(nodes: Node[], edges: Edge[]) {
        const out_edges = edges.filter((e) => e.from === this.id);
        return nodes.filter((n) => out_edges.some((e) => e.to === n.id));
    }

    ins(nodes: Node[], edges: Edge[]) {
        const in_edges = edges.filter((e) => e.to === this.id);
        return nodes.filter((n) => in_edges.some((e) => e.from === n.id));
    }
}

type EdgeParams = RequiredBy<Edge, "from" | "to">;
export class Edge {
    id: string;
    from: string;
    to: string;

    constructor({ from, to }: EdgeParams) {
        this.id = uuid(15);

        this.from = from;
        this.to = to;
    }
}
