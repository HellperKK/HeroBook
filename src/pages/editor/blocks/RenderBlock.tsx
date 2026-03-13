import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState } from '../../../store/store';
import type { Block, ImageBlock } from '../../../utils/game/Block';
import './renderBlock.scss';
import { oppositeColorRGB } from '../../../utils/oppositeColorRGB';
import { useEffect, useState } from 'react';
import { BaseDirectory, readFile } from '@tauri-apps/plugin-fs';
import noImage from '../../../assets/images/no-image.png';

type Props = {
  block: Block;
  onClick?: () => void;
  active: boolean;
};

export default function RenderBlock({ block, onClick, active }: Props) {
  const [path, setPath] = useState<string | undefined>(undefined);
  const {
    pages,
    settings: { format, folderName },
  } = useSelector((state: RootState) => state.project);

  const loadPath = async () => {
    if (block.type === 'image') {
      const assetsPath = `herobook/projects/${folderName}/images/${block.path}`;
      const blob = await readFile(assetsPath, {
        baseDir: BaseDirectory.Document,
      });
      const base64 = (blob as unknown as { toBase64: () => string }).toBase64();
      setPath(`data:image/png;base64,${base64}`);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: is safe
  useEffect(() => {
    loadPath();
  }, [(block as ImageBlock).path]);

  const params = useParams();

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;

  const pageColor = page.format?.page ?? format.page;

  if (block.type === 'text') {
    console.log(block.format?.textFont ?? page.format?.textFont ?? format.textFont);
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: false positive
      // biome-ignore lint/a11y/useKeyWithClickEvents: false positive
      <div
        onClick={onClick}
        className={`text-block`}
        style={{
          border: active ? `3px solid ${oppositeColorRGB(pageColor)}` : 'none',
        }}
      >
        <pre
          style={{
            fontFamily: block.format?.textFont ?? page.format?.textFont ?? format.textFont,
            color: block.format?.textColor ?? page.format?.textColor ?? format.textColor,
          }}
        >
          {block.content}
        </pre>
      </div>
    );
  }

  if (block.type === 'choice') {
    return (
      <div
        className={`button-choice`}
        style={{
          border: active ? `3px solid ${oppositeColorRGB(pageColor)}` : 'none',
        }}
      >
        <button
          type="button"
          style={{
            backgroundColor: block.format?.btnColor ?? page.format?.btnColor ?? format.btnColor,
            color: block.format?.btnTextColor ?? page.format?.btnTextColor ?? format.btnTextColor,
            fontFamily: block.format?.btnFont ?? page.format?.btnFont ?? format.btnFont,
          }}
          onClick={onClick}
        >
          {block.text}
        </button>
      </div>
    );
  }

  if (block.type === 'image') {
    const src = block.path !== '' ? path : noImage;
    return (
      <div className="image-block">
        {/** biome-ignore lint/a11y/noStaticElementInteractions: false positive */}
        {/** biome-ignore lint/a11y/useKeyWithClickEvents: false positive */}
        <img
          src={src}
          alt=""
          width={+(block.format.width ?? page.format.width ?? format.width)}
          height={+(block.format.height ?? page.format.height ?? format.height)}
          onClick={onClick}
        />
      </div>
    );
  }

  return <div className="render-block">not managed</div>;
}
