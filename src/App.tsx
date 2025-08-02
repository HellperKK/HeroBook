import {
	BaseDirectory,
	exists,
	mkdir,
	readTextFile,
	writeTextFile,
} from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import MenuLayout from "./components/layout/menuLayout/MenuLayout";
import NewProject from "./pages/new-project/NewProject";
import StartPage from "./pages/start-page/StartPage";
import { camelToKebab } from "./utils/camelToKebab";
import SettingsContext from "./utils/contexts/settingsContext";
import { isDesktopApp } from "./utils/isDesktopApp";
import { projectsPath, rootPath } from "./utils/paths";
import { defaultTheme } from "./utils/styles/default";
import type { Theme } from "./utils/styles/Theme";

export default function App() {
	const [theme, setTheme] = useState<Theme>(defaultTheme);

	const updateTheme = (partialTheme: Partial<Theme>) => {
		const newTheme = Object.assign({}, theme, partialTheme);
		setTheme(newTheme);
		saveTheme(newTheme);

		for (const [name, value] of Object.entries(newTheme)) {
			document.documentElement.style.setProperty(
				`--${camelToKebab(name)}`,
				value.toString(),
			);
		}
	};

	const loadTheme = async () => {
		const configFilePath = "template-config.json";

		if (await isDesktopApp()) {
			const fileExists = await exists(configFilePath, {
				baseDir: BaseDirectory.Config,
			});

			if (fileExists) {
				const content = await readTextFile(configFilePath, {
					baseDir: BaseDirectory.Config,
				});
				const theme = JSON.parse(content);
				updateTheme(theme);
			}
		} else {
			const content = localStorage.getItem("template-config");

			if (content !== null) {
				const theme = JSON.parse(content);
				updateTheme(theme);
			}
		}
	};

	const saveTheme = async (theme: Theme) => {
		const configFilePath = "template-config.json";

		if (await isDesktopApp()) {
			await writeTextFile(configFilePath, JSON.stringify(theme, null, 4), {
				baseDir: BaseDirectory.Config,
			});
		} else {
			localStorage.setItem("template-config", JSON.stringify(theme));
		}
	};

	const manageProjectsDirectories = async () => {
		const isDesktop = await isDesktopApp();
		if (!isDesktop) {
			return;
		}

		let projectsDirectoryExists = await exists(rootPath, {
			baseDir: BaseDirectory.Document,
		});
		if (!projectsDirectoryExists) {
			await mkdir(rootPath, { baseDir: BaseDirectory.Document });
		}

		projectsDirectoryExists = await exists(projectsPath, {
			baseDir: BaseDirectory.Document,
		});
		if (!projectsDirectoryExists) {
			await mkdir(projectsPath, { baseDir: BaseDirectory.Document });
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: false positive
	useEffect(() => {
		manageProjectsDirectories();
		loadTheme();
	}, []);

	return (
		<SettingsContext.Provider value={theme}>
			<MenuLayout theme={theme} updateTheme={updateTheme}>
				<HashRouter>
					<Routes>
						<Route path="/" element={<StartPage />} />
						<Route path="/new" element={<NewProject />} />
					</Routes>
				</HashRouter>
			</MenuLayout>
		</SettingsContext.Provider>
	);
}
