import Button from "../../components/inputs/button/Button";
import "./newProject.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../../components/inputs/textField/TextField";
import Toggle from "../../components/inputs/toggle/Toggle";
import Label from "../../components/texts/label/Label";

export default function NewProject() {
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
					onClick={() => {
						if (
							formState.projectName === "" ||
							formState.projectAuthor === ""
						) {
							return;
						}

						console.log(formState);
					}}
				>
					Create
				</Button>
				<Button onClick={() => navigate("/")}>Cancel</Button>
			</div>
		</div>
	);
}
