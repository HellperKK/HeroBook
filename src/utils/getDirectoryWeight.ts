import { BaseDirectory, lstat } from "@tauri-apps/plugin-fs";
import { scanDirectoryFiles } from "./scanDirectoryFiles";

export async function getDirectoryWeight(path: string) {
    const files = await scanDirectoryFiles(path, { baseDir: BaseDirectory.Document });
    const fileStats = await Promise.all(files.map((file) => lstat(`${file}`, { baseDir: BaseDirectory.Document })));
    const size = fileStats.reduce((acc, fileStat) => acc + fileStat.size, 0);
    return size;
  }