import { serializeClass } from "./helpers";

export default (
    content: string,
    attr?: {
        class?: string | (string | boolean)[] | Record<string, boolean>;
    },
): string => {
    return /* html */ `<span ${attr?.class ? `class="${serializeClass(attr.class)}"` : ""}>${content}</span>`;
};
