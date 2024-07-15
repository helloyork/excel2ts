import { Project, ProjectOptions } from "ts-morph";



type Dts = {
    fields: {
        name: string;
        type: string;
        jsdoc?: string;
    }[];
    file: string;
    interfaceName: string;
};

export async function generateInterface(input: Dts, projectConfig: ProjectOptions) {
    const project = new Project(projectConfig);
    const sourceFile = project.createSourceFile(input.file, undefined, { overwrite: true });

    const interfaceDeclaration = sourceFile.addInterface({
        name: input.interfaceName,
        isExported: true,
    });
    for (const field of input.fields) {
        interfaceDeclaration.addProperty({
            name: field.name,
            type: field.type,
            hasQuestionToken: field.type.endsWith('?'),
            ...(field.jsdoc ? { docs: [{ description: field.jsdoc }] } : {}),
        });
    }

    await sourceFile.save();
}
