
export type Ty = "string" | "number" | "boolean" | "float" | "int";

export function to<T = any>(content: unknown, type: Ty | string): T | unknown {
    switch (type) {
        case "string":
            return (content?.toString ? content.toString() : String(content)) as unknown as T;
        case "number":
            return Number(content) as unknown as T;
        case "boolean":
            if (typeof content === "boolean") return content as unknown as T;
            if (String(content).toLowerCase() === "true") return true as unknown as T;
            if (String(content).toLowerCase() === "false") return false as unknown as T;
            return Boolean(content) as unknown as T;
        case "float":
            return parseFloat(content?.toString() ? content.toString() : String(content)) as unknown as T;
        case "int":
            return parseInt(content?.toString() ? content.toString() : String(content)) as unknown as T;
        default:
            return content;
    }
}

