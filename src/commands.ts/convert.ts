import { App, CommandNames, Options } from "../cli/cli";
import { generateDataClass } from "../generator/class";
import { generateInterface } from "../generator/dts";
import { loadParser, Parsers } from "../parser/parser";
import { FolderReader } from "../util/fs";
import { sanitizeString } from "../util/str";

import path from "path";
import { ScriptTarget } from "ts-morph";

function resolveIfNotAbsolute(
    { file, base, defaultValue }: { file?: string, base: string, defaultValue: string }
): string {
    return file ? (path.isAbsolute(file) ? file : path.resolve(base, file)) : path.resolve(base, defaultValue);
}

export async function convert() {
    const input = App.getInstance().getOpts(CommandNames.Convert)?.input;
    if (!input) {
        console.error("input is required, use -i or --input");
        process.exit(1);
    }

    const isInputFolder = await FolderReader.getInstance().getType(input) === FolderReader.FileTypes.FOLDER;
    const target = isInputFolder ? (await FolderReader.getInstance().forEach(input))
        .filter(file => file.type === FolderReader.FileTypes.FILE)
        .map(file => file.path) : [input]
    const csvs: string[] = target.filter(file => file.endsWith(".csv"));

    console.log(csvs); // test

    const convert = await loadParser(Parsers.CSV);
    const converted = await Promise.all(csvs.map(async file => {
        const parsed = await convert.parse(file);
        return {
            ...convert.type(parsed),
            file,
        };
    }));
    console.log(JSON.stringify(converted, null, 2)); // test

    const outputDeclarationDir = resolveIfNotAbsolute({
        file: App.getInstance().getOpts<Options>(CommandNames.Convert)?.declaration,
        base: process.cwd(),
        defaultValue: isInputFolder ? path.relative(process.cwd(), input) : path.dirname(input)
    });
    const outputTypescriptDir = resolveIfNotAbsolute({
        file: App.getInstance().getOpts<Options>(CommandNames.Convert)?.typescript,
        base: process.cwd(),
        defaultValue: outputDeclarationDir
    });

    await Promise.all(converted.map(async ({ headers, data, file }) => {
        const key = App.getInstance().getOpts<Options>(CommandNames.Convert)?.key
        if (key && !!headers.find(h => h.name === key)) {
            headers = headers.filter(h => h.name !== key);
            data = Object.fromEntries(data.map(d => [d[key], d]));
        }

        await Promise.all([
            generateInterface({
                fields: headers,
                file: path.resolve(outputDeclarationDir, path.basename(file, ".csv") + ".d.ts"),
                interfaceName: sanitizeString(path.basename(file, ".csv")),
            }, {
                compilerOptions: {
                    target: ScriptTarget.ES2023,
                }
            }),
            generateDataClass({
                className: sanitizeString(path.basename(file, ".csv")),
                file: path.resolve(outputTypescriptDir, path.basename(file, ".csv") + ".ts"),
                data,
            }, {
                compilerOptions: {
                    target: ScriptTarget.ES2023,
                }
            }),
        ]);
    }));

    console.log("Declaration files generated at:", outputDeclarationDir);
    console.log("Typescript files generated at:", outputTypescriptDir);
}
