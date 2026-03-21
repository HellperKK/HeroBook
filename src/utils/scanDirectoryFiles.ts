import { BaseDirectory, type ReadDirOptions, readDir } from '@tauri-apps/plugin-fs';

export async function scanDirectoryFiles(path: string, options: ReadDirOptions) {
  const entries = await readDir(path, { baseDir: BaseDirectory.Document });
  let results: Array<string> = entries.filter((entry) => entry.isFile).map((entry) => `${path}/${entry.name}`);
  for (const entry of entries) {
    if (entry.isDirectory) {
      const subEntries = await scanDirectoryFiles(`${path}/${entry.name}`, options);
      results = [...results, ...subEntries];
    }
  }
  return results;
}
