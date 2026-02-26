import { BaseDirectory, type DirEntry, exists, readDir, readTextFile } from '@tauri-apps/plugin-fs';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/inputs/button/Button';
import GridLayout from '../../components/layout/gridLayout/GridLayout';
import Paper from '../../components/surfaces/paper/Paper';
import Label from '../../components/texts/label/Label';
import Text from '../../components/texts/text/Text';
import { loadProject } from '../../store/projectSlice';
import type { Project } from '../../utils/game/Project';
import { projectsPath } from '../../utils/paths';

export default function OpenPlay() {
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
    <div className="open-project-page">
      <Paper>
        <Button onClick={() => navigate('/')}>Go back</Button>
        <GridLayout columns={1} rows={2} className="open-project-grid">
          <div className="open-project-header">
            <Label width="100%">Open a Project</Label>
            <Text>Select a project to start playing.</Text>
          </div>
          <div className="open-project-list">
            {project.length === 0 ? (
              <Text>No projects found.</Text>
            ) : (
              project.map((project) => (
                <div className="open-project-item" key={project.name}>
                  <Text>{project.name}</Text>
                  <Button
                    className="open-project-open-btn"
                    onClick={async () => {
                      const dataTxt = await readTextFile(`${projectsPath}/${project.name}/data.json`, {
                        baseDir: BaseDirectory.Document,
                      });
                      const data: Project = JSON.parse(dataTxt);

                      dispatch(loadProject(data));
                      navigate(`/play/page/0`);
                    }}
                  >
                    Open
                  </Button>
                </div>
              ))
            )}
          </div>
        </GridLayout>
      </Paper>
    </div>
  );
}
