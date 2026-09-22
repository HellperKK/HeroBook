import {
  BaseDirectory,
  type DirEntry,
  exists,
  mkdir,
  readDir,
  readFile,
  readTextFile,
  writeFile,
} from '@tauri-apps/plugin-fs';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/inputs/button/Button';
import ButtonGroup from '../../components/inputs/buttonGroup/buttonGroup';
import Paper from '../../components/surfaces/paper/Paper';
import Label from '../../components/texts/label/Label';
import { editProject, loadProject } from '../../store/projectSlice';
import type { Project } from '../../utils/game/Project';
import { gamesPath, projectsPath } from '../../utils/paths';

import './startPage.scss';
import GridLayout from '../../components/layout/gridLayout/GridLayout';
import { open } from '@tauri-apps/plugin-dialog';
import JSZip, { type JSZipObject } from 'jszip';

export default function StartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [projects, setProjects] = useState<Array<DirEntry>>([]);
  const [games, setGames] = useState<Array<DirEntry>>([]);

  const loadLists = async () => {
    const files = await readDir(projectsPath, {
      baseDir: BaseDirectory.Document,
    });

    const validDirs = await files.reduce(async (memo, file) => {
      const trueMemo = await memo;

      if (
        file.isDirectory &&
        (await exists(`${projectsPath}/${file.name}/data.json`, {
          baseDir: BaseDirectory.Document,
        }))
      ) {
        trueMemo.push(file);
      }

      return trueMemo;
    }, Promise.resolve<Array<DirEntry>>([]));

    setProjects(validDirs);

    const gameFiles = await readDir(gamesPath, {
      baseDir: BaseDirectory.Document,
    });

    const gameValidDirs = await gameFiles.reduce(async (memo, file) => {
      const trueMemo = await memo;

      if (
        file.isDirectory &&
        (await exists(`${gamesPath}/${file.name}/data.json`, {
          baseDir: BaseDirectory.Document,
        }))
      ) {
        trueMemo.push(file);
      }

      return trueMemo;
    }, Promise.resolve<Array<DirEntry>>([]));

    setGames(gameValidDirs);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: useless dependency
  useEffect(() => {
    loadLists();
  }, []);

  const loadProjectData = async (projectName: string, path: string) => {
    const dataTxt = await readTextFile(`${path}/${projectName}/data.json`, {
      baseDir: BaseDirectory.Document,
    });
    const data: Project = JSON.parse(dataTxt);

    return data;
  };

  return (
    <div className="start-page">
      <GridLayout columns={2} rows={1}>
        <Paper className="start-page-paper">
          <Button
            className="new-project-button"
            onClick={() => {
              navigate(`/new`);
            }}
          >
            New project
          </Button>
          {projects.map((project) => (
            <div key={project.name} className="project-entry">
              <Label>{project.name}</Label>
              <ButtonGroup>
                <Button
                  onClick={async () => {
                    const projectData = await loadProjectData(project.name, projectsPath);
                    dispatch(editProject(projectData));
                    navigate(`/editor`);
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={async () => {
                    const projectData = await loadProjectData(project.name, projectsPath);
                    dispatch(loadProject(projectData));
                    navigate(`/play/page/0`);
                  }}
                >
                  Play
                </Button>
              </ButtonGroup>
            </div>
          ))}
        </Paper>
        <Paper className="start-page-paper">
          <Button
            className="new-project-button"
            onClick={async () => {
              const filePath = await open({
                directory: false,
                multiple: false,
                filters: [
                  {
                    name: 'Zip',
                    extensions: ['zip'],
                  },
                ],
              });

              if (filePath === null) {
                return;
              }

              const bin = await readFile(filePath);

              const zip = new JSZip();
              await zip.loadAsync(bin);

              const dataFile = await zip.file('data.json');
              if (dataFile === null) {
                return;
              }

              const data: Project = JSON.parse(await dataFile.async('string'));

              const path = `${gamesPath}/${data.settings.folderName}`;

              await mkdir(path, { baseDir: BaseDirectory.Document });

              const files: Array<{ path: string; file: JSZipObject }> = [];
              zip.forEach(async (relativePath, file) => {
                files.push({ path: relativePath, file });
              });

              const promises = files.map(async (file) => {
                if (file.file.dir) {
                  await mkdir(`${path}/${file.path}`, { baseDir: BaseDirectory.Document });
                } else {
                  const fileData = await zip.file(file.path)?.async('uint8array');
                  if (!fileData) return;

                  await writeFile(`${path}/${file.path}`, fileData, { baseDir: BaseDirectory.Document });
                }
              });

              await Promise.all(promises);
              await loadLists();
            }}
          >
            Import game
          </Button>
          {games.map((project) => (
            <div key={project.name} className="project-entry">
              <Label>{project.name}</Label>
              <ButtonGroup>
                <Button
                  onClick={async () => {
                    const projectData = await loadProjectData(project.name, projectsPath);
                    dispatch(loadProject(projectData));
                    navigate(`/play/page/0`);
                  }}
                >
                  Play
                </Button>
              </ButtonGroup>
            </div>
          ))}
        </Paper>
      </GridLayout>
    </div>
  );
}
