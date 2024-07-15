import { Project, ProjectOptions } from "ts-morph";

type DataClassConfig<T = {}> = {
    className: string;
    file: string;
    data: Data<T>;
}
type Data<T> = Record<string, any> & T;

export async function generateDataClass(input: DataClassConfig, projectConfig: ProjectOptions) {
    const project = new Project(projectConfig);
    const sourceFile = project.createSourceFile(input.file, undefined, { overwrite: true });

    const classDeclaration = sourceFile.addClass({
        name: input.className,
        isExported: true,
    });
    classDeclaration.addProperty({
        name: "data",
        isReadonly: true,
        isStatic: true,
        initializer: JSON.stringify(input.data, null, 4),
    });

    await sourceFile.save();
}

