import Button from '../../components/inputs/button/Button';
import TextField from '../../components/inputs/textField/TextField';
import Toggle from '../../components/inputs/toggle/Toggle';
import GridLayout from '../../components/layout/gridLayout/GridLayout';
import Paper from '../../components/surfaces/paper/Paper';
import Label from '../../components/texts/label/Label';
import Text from '../../components/texts/text/Text';
import './newProject.scss';
import { BaseDirectory, exists, mkdir, writeTextFile } from '@tauri-apps/plugin-fs';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeGlobalSettings } from '../../store/projectSlice';
import { emptyProject } from '../../utils/game/empty/emptyProject';
import { projectsPath } from '../../utils/paths';
import { safeProjectName } from '../../utils/safeProjectName';

export default function NewProject() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    projectName: '',
    projectAuthor: '',
    expertMode: false,
  });

  const updateFormState = (data: Partial<typeof formState>) => setFormState((prev) => ({ ...prev, ...data }));

  return (
    <div className="new-project-page">
      <Paper>
        <Button onClick={() => navigate('/')}>Go back</Button>
        <GridLayout columns={1} rows={2} className="new-project-grid">
          <div className="new-project-header">
            <Label width="100%">Create a new project</Label>
            <Text>Set up your project's basic information before jumping into the editor.</Text>
          </div>
          <div className="new-project-form">
            <div className="new-project-field-row">
              <Label width="150px">Project name</Label>
              <TextField value={formState.projectName} onChange={(value) => updateFormState({ projectName: value })} />
            </div>
            <div className="new-project-field-row">
              <Label width="150px">Project author</Label>
              <TextField
                value={formState.projectAuthor}
                onChange={(value) => updateFormState({ projectAuthor: value })}
              />
            </div>
            <div className="new-project-field-row">
              <Label width="150px">Expert mode</Label>
              <Toggle checked={formState.expertMode} onChange={(value) => updateFormState({ expertMode: value })} />
            </div>
            <div className="new-project-actions">
              <Button onClick={() => navigate('/')}>Cancel</Button>
              <Button
                onClick={async () => {
                  if (formState.projectName === '' || formState.projectAuthor === '') {
                    console.log('empty project name or author');
                    return;
                  }

                  const safeName = safeProjectName(formState.projectName);
                  const projectPath = `${projectsPath}/${safeName}`;
                  const project = structuredClone(emptyProject);
                  Object.assign(project.settings, {
                    folderName: safeName,
                    gameTitle: formState.projectName,
                    author: formState.projectAuthor,
                    expert: formState.expertMode,
                  });

                  if (
                    await exists(projectPath, {
                      baseDir: BaseDirectory.Document,
                    })
                  ) {
                    console.log('project already exists');
                    return;
                  }
                  await mkdir(projectPath, {
                    baseDir: BaseDirectory.Document,
                  });
                  await mkdir(`${projectPath}/images`, {
                    baseDir: BaseDirectory.Document,
                  });
                  await mkdir(`${projectPath}/musics`, {
                    baseDir: BaseDirectory.Document,
                  });
                  await mkdir(`${projectPath}/sounds`, {
                    baseDir: BaseDirectory.Document,
                  });
                  await mkdir(`${projectPath}/videos`, {
                    baseDir: BaseDirectory.Document,
                  });
                  await mkdir(`${projectPath}/fonts`, {
                    baseDir: BaseDirectory.Document,
                  });

                  await writeTextFile(`${projectPath}/data.json`, JSON.stringify(project, null, 4), {
                    baseDir: BaseDirectory.Document,
                  });
                  dispatch(
                    changeGlobalSettings({
                      folderName: safeName,
                      gameTitle: formState.projectName,
                      author: formState.projectAuthor,
                      expert: formState.expertMode,
                    }),
                  );

                  navigate('/editor');
                }}
              >
                Create
              </Button>
            </div>
          </div>
        </GridLayout>
      </Paper>
    </div>
  );
}
