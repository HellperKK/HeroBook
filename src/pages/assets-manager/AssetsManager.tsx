import { useSelector } from 'react-redux';
import TabPannel from '../../components/surfaces/tabs/TabPannel';
import Tabs from '../../components/surfaces/tabs/Tabs';
import './assetsManager.scss';
import type { RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import { BaseDirectory, type DirEntry, readDir, readFile, writeFile } from '@tauri-apps/plugin-fs';
import { open } from '@tauri-apps/plugin-dialog';
import Button from '../../components/inputs/button/Button';
import { fileName } from '../../utils/fileName';

export default function AssetsManager() {
  const project = useSelector((state: RootState) => state.project);

  const [assets, setAssets] = useState<Array<DirEntry>>([]);

  const assetsPath = `herobook/projects/${project.settings.folderName}/images`;

  const loadImages = async () => {
    const images = await readDir(assetsPath, { baseDir: BaseDirectory.Document });
    setAssets(images);
  };

  const importAssets = async () => {
    const files = await open({
      multiple: true,
      directory: false,
    });

    if (files == null) {
      return;
    }

    await Promise.all(
      files.map(async (file) => {
        const content = await readFile(file);
        await writeFile(`${assetsPath}/${fileName(file)}`, content, { baseDir: BaseDirectory.Document });
      }),
    );

    await loadImages();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: will run only once
  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div className="assets-manager">
      <Tabs>
        <TabPannel title="Images">{/* Content for images */}</TabPannel>
        <TabPannel title="Videos" disabled>
          {/* Content for videos */}
        </TabPannel>
        <TabPannel title="Musics" disabled>
          {/* Content for musics */}
        </TabPannel>
        <TabPannel title="Sounds" disabled>
          {/* Content for sounds */}
        </TabPannel>
      </Tabs>
      <div>
        <div>
          {assets.map((asset) => (
            <Button key={asset.name}>{fileName(asset.name, false)}</Button>
          ))}
          <Button onClick={importAssets}>+</Button>
        </div>
      </div>
    </div>
  );
}
