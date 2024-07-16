import { Command, OptionValues, program } from 'commander';

import { Singleton } from '../util/singleton';
import { version } from '..';
import { convert as command_convert } from '../commands.ts/convert';

type Options = {
    input: string;
    declaration: string;
    typescript: string;
    key: string;
};

enum CommandNames {
    Convert = 'convert',
}

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
            .option('-k, --key [key]', 'key column name')
            .action(() => command_convert());
        program.version(version)
        program.description('excel to typescript')
            .addCommand(convert)
            .parse(process.argv);
        return this;
    }
    opts() {
        return program.opts();
    }
    getOpts<T extends OptionValues>(name: CommandNames): T | undefined {
        return program.commands.find(command => command.name() === name)?.opts<T>();
    }

}

export {
    CommandNames,
}

export type {
    Options,
}
