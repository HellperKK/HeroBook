import Jinter from 'jintr';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState } from '../../../store/store';
import type { Block, ImageBlock } from '../../../utils/game/Block';
import { useEffect, useState } from 'react';
import { BaseDirectory, readFile } from '@tauri-apps/plugin-fs';
import noImage from '../../../assets/images/no-image.png';

type Props = {
  block: Block;
  onClick?: (id: number, action: string) => void;
  // biome-ignore lint/suspicious/noExplicitAny: safe any
  state: any;
};

export default function RenderBlock({ block, onClick, state }: Props) {
  const params = useParams();
  const {
    pages,
    settings: { format, folderName },
  } = useSelector((state: RootState) => state.project);
  const [path, setPath] = useState<string | null>(null);

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

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;

  if (block.type === 'text') {
    console.log(block.format?.textFont ?? page.format?.textFont ?? format.textFont);
    return (
      <div className={`text-block`}>
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
    const condition = block.condition || 'true';
    const jinter = new Jinter();
    jinter.defineObject('$state', state);
    const conditionResult = jinter.evaluate(condition);
    return (
      <>
        {conditionResult && (
          <div className={`button-choice`}>
            <button
              type="button"
              style={{
                backgroundColor: block.format?.btnColor ?? page.format?.btnColor ?? format.btnColor,
                color: block.format?.btnTextColor ?? page.format?.btnTextColor ?? format.btnTextColor,
                fontFamily: block.format?.btnFont ?? page.format?.btnFont ?? format.btnFont,
              }}
              onClick={() => {
                if (onClick) onClick(block.pageId, block.action || '');
              }}
            >
              {block.text}
            </button>
          </div>
        )}
      </>
    );
  }

  if (block.type === 'image') {
    const src = block.path !== '' ? path : noImage;
    return (
      <div className="image-block">
        <img
          src={src}
          alt=""
          width={+(block.format.width ?? page.format.width ?? format.width)}
          height={+(block.format.height ?? page.format.height ?? format.height)}
        />
      </div>
    );
  }

  return <div className="render-block">not managed</div>;
}
