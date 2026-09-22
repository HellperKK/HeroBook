import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';
import { projectsPath } from './paths';
import { Project } from './game/Project';

export async function saveProject(project: Project) {
  await writeTextFile(`${projectsPath}/${project.settings.folderName}/data.json`, JSON.stringify(project, null, 4), {
    baseDir: BaseDirectory.Document,
  });
}
