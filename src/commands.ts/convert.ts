import { App } from "../cli/cli";
import { loadParser, Parsers } from "../parser/parser";
import { FolderReader } from "../util/fs";

export async function convert() {
    const input = App.getInstance().opts().input;
    const target = await FolderReader.getInstance().getType(input) === FolderReader.FileTypes.FOLDER ?
        (await FolderReader.getInstance().forEach(input))
            .filter(file => file.type === FolderReader.FileTypes.FILE)
            .map(file => file.path) : [input]
    const csvs = target.filter(file => file.endsWith(".csv")); // test

    console.log(csvs);

    const convert = await loadParser(Parsers.CSV);
    const converted = await Promise.all(csvs.map(async file => {
        const parsed = await convert.parse(file);
        return convert.type(parsed);
    }));
    console.log(converted);

}
