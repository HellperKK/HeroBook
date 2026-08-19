import { useEffect, useState } from 'react';
import type { ImageBlock } from '../../../utils/game/Block';
import { projectsPath } from '../../../utils/paths';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { BaseDirectory, readFile } from '@tauri-apps/plugin-fs';
import noImage from '../../../assets/images/no-image.png';
import { useParams } from 'react-router-dom';
import { oppositeColorRGB } from '../../../utils/oppositeColorRGB';

type Props = {
  block: ImageBlock;
  onClick: () => void;
  active: boolean;
};

export default function ImageBlockComponent({ block, onClick, active }: Props) {
  const {
    pages,
    settings: { format, folderName },
  } = useSelector((state: RootState) => state.project.project);

  const params = useParams();

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;
  const pageColor = page.format?.page ?? format.page;

  const [path, setPath] = useState<string | undefined>(undefined);

  const loadPath = async () => {
    if (block.type === 'image') {
      const assetsPath = `${projectsPath}/${folderName}/images/${block.path}`;
      const blob = await readFile(assetsPath, {
        baseDir: BaseDirectory.Document,
      });
      const base64 = blob.toBase64();
      setPath(`data:image/png;base64,${base64}`);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: is safe
  useEffect(() => {
    loadPath();
  }, [block.path]);

  const src = block.path !== '' ? path : noImage;
  return (
    <div className="image-block">
      {/** biome-ignore lint/a11y/noStaticElementInteractions: false positive */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: false positive */}
      <img
        style={{
          border: active ? `3px solid ${oppositeColorRGB(pageColor)}` : 'none',
        }}
        src={src}
        alt=""
        width={+(block.format.width ?? page.format.width ?? format.width)}
        height={+(block.format.height ?? page.format.height ?? format.height)}
        onClick={onClick}
      />
    </div>
  );
}
