import { BaseDirectory, DirEntry, exists, readDir, readTextFile } from '@tauri-apps/plugin-fs';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/inputs/button/Button';
import ButtonGroup from '../../components/inputs/buttonGroup/buttonGroup';
import Paper from '../../components/surfaces/paper/Paper';
import Label from '../../components/texts/label/Label';
import { editProject, loadProject } from '../../store/projectSlice';
import { Project } from '../../utils/game/Project';
import { projectsPath } from '../../utils/paths';

import './startPage.scss';

export default function StartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [projects, setProjects] = useState<Array<DirEntry>>([]);

  const loadProjectList = async () => {
    const files = await readDir(projectsPath, {
      baseDir: BaseDirectory.Document,
    });

    const validDirs = await files.reduce(async (memo, file) => {
      const trueMemo = await memo;
      console.log(file);

      if (
        file.isDirectory &&
        (await exists(`${projectsPath}/${file.name}/data.json`, {
          baseDir: BaseDirectory.Document,
        }))
      ) {
        trueMemo.push(file);
        console.log("valid", await exists(`${projectsPath}/${file.name}/data.json`, {
          baseDir: BaseDirectory.Document,
        }));
      }

      return trueMemo;
    }, Promise.resolve<Array<DirEntry>>([]));

    setProjects(validDirs);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: useless dependency
  useEffect(() => {
    loadProjectList();
  }, []);

  console.log(projects);

  const loadProjectData = async (projectName: string) => {
    const dataTxt = await readTextFile(`${projectsPath}/${projectName}/data.json`, {
      baseDir: BaseDirectory.Document,
    });
    const data: Project = JSON.parse(dataTxt);

    return data;
  }

  return (
    <div className="start-page">
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
                  const projectData = await loadProjectData(project.name);
                  dispatch(editProject(projectData));
                  navigate(`/editor`);
                }}
              >
                Edit
              </Button>
              <Button
                onClick={async () => {
                  const projectData = await loadProjectData(project.name);
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
    </div>
  );
}
