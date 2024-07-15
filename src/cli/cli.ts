import { Command, program } from 'commander';

import { Singleton } from '../util/singleton';
import { version } from '..';
import { convert as command_convert } from '../commands.ts/convert';

type Options = {
    input: string;
    declaration: string;
    typescript: string;
};

export class App extends Singleton<App>() {
    private constructor() {
        super();
    }
    public init() {
        const convert = new Command('convert')
            .description('convert excel to typescript')
            .option('-i, --input <input>', 'input excel file path or directory')
            .option('-d, --declaration [output]', 'output typescript declaration directory')
            .option('-t, --typescript [output]', 'output typescript directory')
            .action(() => command_convert());
        program
            .version(version)
            .description('excel to typescript')
            .addCommand(convert)
            .parse(process.argv);
        return this;
    }
    opts() {
        return program.opts<Options>();
    }

}
