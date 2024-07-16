import { FolderReader } from "../util/fs";
import type { IParser, Parsed, ParsedType } from "./parser";

import papaparse from "papaparse";
import { to } from "./to";

async function parse(file: string): Promise<{ headers: string[]; data: any[]; }> {
    try {
        const content = await FolderReader.getInstance().readFile(file);
        const { data, meta } = papaparse.parse<Record<string, unknown>>(content, { header: true });

        const headers = meta.fields ?? [];

        const firstRow = data.shift();
        if (firstRow) {
            for (let i = 0; i < headers.length; i++) {
                headers[i] = headers[i] + ":" + (firstRow[headers[i]] ?? "any");
            }
        }
        return { headers, data };
    } catch (error: any) {
        throw new Error(`Error reading file: ${error.message}\nraw: ${error}`);
    }
}

function splitType(header: string, separator = ":"): [string, string] {
    const splited = header.split(separator);
    const type = (splited.pop() ?? "any").trim();
    const name = (splited.join(separator)).trim();
    return [name, type];

}

function type(content: Parsed): ParsedType {
    const headers = new Array(content.headers.length);
    const data = new Array(content.data.length);
    for (let i = 0; i < content.headers.length; i++) {
        const [name, type] = splitType(content.headers[i]);
        headers[i] = { name, type };
    }
    const typeMap = new Map<string, string>();
    headers.forEach(({ name, type }) => typeMap.set(name, type));

    for (let i = 0; i < content.data.length; i++) {
        const row = content.data[i];
        if (!row || Object.values(row).every(v => v === undefined || v === "")) continue;

        const newRow: Record<string, unknown> = {};
        for (const key in row) {
            if (Object.prototype.hasOwnProperty.call(row, key)) {
                if (!key) continue

                const type = typeMap.get(key) ?? "any";
                newRow[key] = to(row[key], type);
            }
        }
        data[i] = newRow;
    }
    return { data: data.filter(Boolean), headers };
}


const Module = {
    parse,
    type,
} satisfies IParser;

export default Module;
