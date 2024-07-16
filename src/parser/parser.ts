import path from "path";

type Parsed = {
    headers: string[];
    data: any[];
};
type ParsedType = {
    headers: {
        name: string;
        type: string;
    }[],
    data: any[];
};
interface IParser {
    parse: (file: string) => Promise<Parsed>;
    type: (content: Parsed) => ParsedType;
}

const Parsers = {
    CSV: "./csv.js",
}

async function loadParser(type: string): Promise<IParser> {
    const parserModule = (await import(path.resolve(__dirname, type)));
    const parser = parserModule.default as IParser;
    return parser;
}

export {
    loadParser,
    Parsers,
};

export type {
    IParser,
    Parsed,
    ParsedType,
};
