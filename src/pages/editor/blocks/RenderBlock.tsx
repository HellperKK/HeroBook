import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState } from '../../../store/store';
import type { Block } from '../../../utils/game/Block';
import './renderBlock.scss';
import { oppositeColorRGB } from '../../../utils/oppositeColorRGB';

type Props = {
  block: Block;
  onClick?: () => void;
  active: boolean;
};

export default function RenderBlock({ block, onClick, active }: Props) {
  const params = useParams();
  const {
    pages,
    settings: { format },
  } = useSelector((state: RootState) => state.project);

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;

  const pageColor = page.format?.page ?? format.page;

  if (block.type === 'text') {
    return (
      <div
        className={`text-block`}
        style={{
          fontFamily: block.format?.textFont ?? page.format?.textFont ?? format.textFont,
          color: block.format?.textColor ?? page.format?.textColor ?? format.textColor,
          border: active ? `3px solid ${oppositeColorRGB(pageColor)}` : 'none',
        }}
      >
        <div onClick={onClick}>{block.content}</div>
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

  return <div className="render-block">not managed</div>;
}
