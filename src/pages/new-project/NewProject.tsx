import Button from "../../components/inputs/button/Button";
import "./newProject.scss";
import {
	BaseDirectory,
	exists,
	mkdir,
	writeTextFile,
} from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextField from "../../components/inputs/textField/TextField";
import Toggle from "../../components/inputs/toggle/Toggle";
import Label from "../../components/texts/label/Label";
import { initProject } from "../../store/projectSlice";
import { emptyProject } from "../../utils/game/empty/emptyProject";
import { projectsPath } from "../../utils/paths";
import { safeProjectName } from "../../utils/safeProjectName";

export default function NewProject() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [formState, setFormState] = useState({
		projectName: "",
		projectAuthor: "",
		expertMode: false,
	});

	const updateFormState = (data: Partial<typeof formState>) =>
		setFormState((prev) => ({ ...prev, ...data }));

	return (
		<div className="center-content">
			<div>
				<h1>New project</h1>
				<div>
					<Label width="150px">Project name</Label>
					<TextField
						value={formState.projectName}
						onChange={(value) => updateFormState({ projectName: value })}
					/>
				</div>
				<div>
					<Label width="150px">Project author</Label>
					<TextField
						value={formState.projectAuthor}
						onChange={(value) => updateFormState({ projectAuthor: value })}
					/>
				</div>
				<div>
					<Label width="150px">Expert mode ?</Label>
					<Toggle
						checked={formState.expertMode}
						onChange={(value) => updateFormState({ expertMode: value })}
					/>
				</div>
				<Button
					onClick={async () => {
						if (
							formState.projectName === "" ||
							formState.projectAuthor === ""
						) {
							console.log("empty project name or author");
							return;
						}

						const safeName = safeProjectName(formState.projectName);
						const projectPath = `${projectsPath}/${safeName}`;

						if (
							await exists(projectPath, { baseDir: BaseDirectory.Document })
						) {
							console.log("project already exists");
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
						await writeTextFile(
							`${projectPath}/data.json`,
							JSON.stringify(emptyProject, null, 4),
							{
								baseDir: BaseDirectory.Document,
							},
						);
						dispatch(
							initProject({
								gameTitle: formState.projectName,
								author: formState.projectAuthor,
								expert: formState.expertMode,
							}),
						);

						navigate("/editor");
					}}
				>
					Create
				</Button>
				<Button onClick={() => navigate("/")}>Cancel</Button>
			</div>
		</div>
	);
}
