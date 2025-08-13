import { type ReactElement, useState } from "react";
import Button from "../../components/inputs/button/Button";
import FileTabs from "../../components/surfaces/file-tabs/Tabs";
import TabPannel from "../../components/surfaces/tabs/TabPannel";
import "./editor.scss";
import FolderBar from "../../components/misc/folder-bar/FolderBar";

type App = {
	name: string;
	element: ReactElement;
};

export default function Editor() {
	const [apps, setApps] = useState<Array<App>>([]);
	const [leftToggle, setLeftToggle] = useState(false);

	const _addApp = (name: string, element: ReactElement) => {
		const newApps = apps.slice();
		newApps.push({ name, element });
		setApps(newApps);
	};

	const deleteApp = (index: number) => {
		const newApps = apps.slice();
		newApps.splice(index, 1);
		setApps(newApps);
	};

	return (
		<div
			className="editor"
			style={{ gridTemplateColumns: leftToggle ? "500px 1fr" : "70px 1fr" }}
		>
			<div className="editor-leftbar">
				<Button onClick={() => setLeftToggle((toggled) => !toggled)}>
					{leftToggle ? "Close" : "Open"}
				</Button>
				{leftToggle && <FolderBar />}
			</div>
			<div className="editor-tabs">
				<FileTabs onTabClose={(index) => deleteApp(index)}>
					{apps.map((app) => (
						<TabPannel key={app.name} title={app.name}>
							{app.element}
						</TabPannel>
					))}
				</FileTabs>
			</div>
		</div>
	);
}
