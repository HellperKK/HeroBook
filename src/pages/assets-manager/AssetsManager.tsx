import { useSelector } from 'react-redux';
import TabPannel from '../../components/surfaces/tabs/TabPannel';
import Tabs from '../../components/surfaces/tabs/Tabs';
import './assetsManager.scss';
import { open } from '@tauri-apps/plugin-dialog';
import { BaseDirectory, type DirEntry, readDir, readFile, writeFile } from '@tauri-apps/plugin-fs';
import { useEffect, useState } from 'react';
import Button from '../../components/inputs/button/Button';
import Text from '../../components/texts/text/Text';
import type { RootState } from '../../store/store';
import { fileName } from '../../utils/fileName';
import { projectsPath } from '../../utils/paths';

export default function AssetsManager() {
  const project = useSelector((state: RootState) => state.project);

  const [assets, setAssets] = useState<Array<DirEntry>>([]);
  const [assetSource, setAssetSource] = useState<string | null>(null);

  const assetsPath = `${projectsPath}/${project.settings.folderName}/images`;

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
        await writeFile(`${assetsPath}/${fileName(file)}`, content, {
          baseDir: BaseDirectory.Document,
        });
      }),
    );

    await loadImages();
  };

  const getSource = async (file:string) => {
    const bytes = await readFile(`${assetsPath}/${fileName(file)}`, { baseDir: BaseDirectory.Document })
    const base64 = (bytes as any).toBase64() as string
    const url = `data:application/octet-stream;base64,${base64}`;
    setAssetSource(url);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: will run only once
  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div className="assets-manager">
      <Tabs>
        <TabPannel title="Images">
          <div className="assets-images">
            <div className="assets-images-list">
              <Button onClick={importAssets}>+</Button>
              {assets.map((asset) => (
                <Button key={asset.name} onClick={() => {getSource(asset.name)}}>{fileName(asset.name, false)}</Button>
              ))}
            </div>
            <div className="assets-images-item">
              {assetSource && <img src={assetSource} alt="" />}
              {!assetSource && <Text>No image selected</Text>}
            </div>
          </div>
        </TabPannel>
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
    </div>
  );
}
