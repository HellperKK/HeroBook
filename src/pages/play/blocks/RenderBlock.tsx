import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState } from '../../../store/store';
import type { Block } from '../../../utils/game/Block';

type Props = {
  block: Block;
  onClick?: (id: number) => void;
};

export default function RenderBlock({ block, onClick }: Props) {
  const params = useParams();
  const {
    pages,
    settings: { format },
  } = useSelector((state: RootState) => state.project);

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;

  if (block.type === 'text') {
    console.log(block.format?.textFont ?? page.format?.textFont ?? format.textFont);
    return (
      <div
        className={`text-block`}
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
      >
        <button
          type="button"
          style={{
            backgroundColor: block.format?.btnColor ?? page.format?.btnColor ?? format.btnColor,
            color: block.format?.btnTextColor ?? page.format?.btnTextColor ?? format.btnTextColor,
            fontFamily: block.format?.btnFont ?? page.format?.btnFont ?? format.btnFont,
          }}
          onClick={() => {
            if (onClick) onClick(block.pageId);
          }}
        >
          {block.text}
        </button>
      </div>
    );
  }

  return <div className="render-block">not managed</div>;
}
