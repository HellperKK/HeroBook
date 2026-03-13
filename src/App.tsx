import { BaseDirectory, exists, mkdir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import MenuLayout from './components/layout/menuLayout/MenuLayout';
import Editor from './pages/editor/Editor';
import GraphPage from './pages/graph/GraphPage';
import NewProject from './pages/new-project/NewProject';
import OpenPlay from './pages/open-play/OpenPlay';
import OpenProject from './pages/open-project/OpenProject';
import Play from './pages/play/Play';
import StartPage from './pages/start-page/StartPage';
import { camelToKebab } from './utils/camelToKebab';
import SettingsContext from './utils/contexts/settingsContext';
import { isDesktopApp } from './utils/isDesktopApp';
import { projectsPath, rootPath } from './utils/paths';
import { defaultTheme } from './utils/styles/default';
import type { Theme } from './utils/styles/Theme';
import AssetsManager from './pages/assets-manager/AssetsManager';

export default function App() {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const updateTheme = (partialTheme: Partial<Theme>) => {
    const newTheme = Object.assign({}, theme, partialTheme);
    setTheme(newTheme);
    saveTheme(newTheme);

    for (const [name, value] of Object.entries(newTheme)) {
      document.documentElement.style.setProperty(`--${camelToKebab(name)}`, value.toString());
    }
  };

  const loadTheme = async () => {
    const configFilePath = 'template-config.json';

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
      const content = localStorage.getItem('template-config');

      if (content !== null) {
        const theme = JSON.parse(content);
        updateTheme(theme);
      }
    }
  };

  const saveTheme = async (theme: Theme) => {
    const configFilePath = 'template-config.json';

    if (await isDesktopApp()) {
      await writeTextFile(configFilePath, JSON.stringify(theme, null, 4), {
        baseDir: BaseDirectory.Config,
      });
    } else {
      localStorage.setItem('template-config', JSON.stringify(theme));
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
    document.addEventListener('keydown', (event) => {
      // Prevent F5 or Ctrl+R (Windows/Linux) and Command+R (Mac) from refreshing the page
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r') || (event.metaKey && event.key === 'r')) {
        event.preventDefault();
      }
    });

    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  }, []);

  return (
    <SettingsContext.Provider value={theme}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MenuLayout theme={theme} updateTheme={updateTheme} />}>
            <Route index element={<StartPage />} />
            <Route path="/new" element={<NewProject />} />
            <Route path="/editor">
              <Route index element={<GraphPage />} />
              <Route path="page/:id" element={<Editor />} />
              <Route path="open" element={<OpenProject />} />
              <Route path="assets" element={<AssetsManager />} />
            </Route>
            <Route path="/play">
              <Route index element={<GraphPage />} />
              <Route path="page/:id" element={<Play />} />
              <Route path="open" element={<OpenPlay />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </SettingsContext.Provider>
  );
}
