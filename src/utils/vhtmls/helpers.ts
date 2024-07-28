export const serializeClass = (
    c: string | (string | boolean)[] | Record<string, boolean>,
): string => {
    if (typeof c === "string") return c;
    if (typeof c === "object" && Array.isArray(c)) {
        return c.reduce<string>((res, v) => {
            if (typeof v === "string") res += ` ${v}`;
            return res;
        }, "");
    }
    return Object.entries(c).reduce<string>((res, [k, v]) => {
        if (v) res += ` ${k}`;
        return res;
    }, "");
};
