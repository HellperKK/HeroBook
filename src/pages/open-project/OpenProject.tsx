import { BaseDirectory, type DirEntry, exists, readDir, readTextFile } from '@tauri-apps/plugin-fs';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/inputs/button/Button';
import { loadProject } from '../../store/projectSlice';
import type { Project } from '../../utils/game/Project';
import { projectsPath } from '../../utils/paths';

export default function OpenProject() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [project, setProjects] = useState<Array<DirEntry>>([]);

  const loadProjectList = async () => {
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
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: useless dependency
  useEffect(() => {
    loadProjectList();
  }, []);

  return (
    <div>
      {project.map((project) => (
        <div key={project.name}>
          {project.name}
          <Button
            onClick={async () => {
              const dataTxt = await readTextFile(`${projectsPath}/${project.name}/data.json`, {
                baseDir: BaseDirectory.Document,
              });
              const data: Project = JSON.parse(dataTxt);

              dispatch(loadProject(data));
              navigate('/editor');
            }}
          >
            Open
          </Button>
        </div>
      ))}
    </div>
  );
}
