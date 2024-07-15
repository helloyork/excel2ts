import { Singleton } from "./singleton";

import fs from "fs/promises";
import path from "path";

type File = { path: string, type: typeof FolderReader.FileTypes[keyof typeof FolderReader.FileTypes] };

export class FolderReader extends Singleton<FolderReader>() {
    static FileTypes = {
        FILE: "file",
        FOLDER: "folder"
    } as const;
    private constructor() { super(); }
    async readFile(file: string): Promise<string> {
        return await fs.readFile(file, "utf-8");
    }
    async forEach(
        folder: string,
        callback?: (file: File) => void,
        recursive = true
    ): Promise<File[]> {
        const files: File[] = [];
        const items = await fs.readdir(folder);
        for (const item of items) {
            const itemPath = path.join(folder, item)
            const stat = await this.getType(itemPath);
            const file = { path: itemPath, type: stat };
            files.push(file);

            if (callback) callback(file);
            if (stat === FolderReader.FileTypes.FOLDER && recursive) {
                await this.forEach(itemPath, callback);
            }
        }
        return files;
    }
    async getType(file: string): Promise<typeof FolderReader.FileTypes[keyof typeof FolderReader.FileTypes]> {
        const stat = await fs.stat(file);
        return stat.isDirectory() ? FolderReader.FileTypes.FOLDER : FolderReader.FileTypes.FILE;
    }
}

export async function readFile(file: string): Promise<string> {
    return await fs.readFile(file, "utf-8");
}

