import { FolderReader } from "../util/fs";
import type { IParser, Parsed, ParsedType } from "./parser";

import papaparse from "papaparse";

async function parse(file: string): Promise<{ headers: string[]; data: any[]; }> {
    try {
        const content = await FolderReader.getInstance().readFile(file);
        const { data, meta } = papaparse.parse<Record<string, unknown>>(content, { header: true });

        const headers = meta.fields ?? [];
        return { headers, data };
    } catch (error: any) {
        throw new Error(`Error reading file: ${error.message}\nraw: ${error}`);
    }
}

function type(content: Parsed): ParsedType {
    const headers = content.headers
        .map(header => {
            const splited = header.split(":");
            const type = (splited.pop() ?? "any").trim();
            const name = (splited.join(":")).trim();
            return { name, type };
        });
    return { data: content.data, headers };
}

const Module = {
    parse,
    type,
} satisfies IParser;

export default Module;
