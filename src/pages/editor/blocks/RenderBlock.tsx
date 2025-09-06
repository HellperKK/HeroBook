import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState } from '../../../store/store';
import type { Block } from '../../../utils/game/Block';
import ButtonChoice from './ButtonChoice';
import './renderBlock.scss';

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
  const activeClass = active ? ' active' : '';

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;

  if (block.type === 'text') {
    return (
      <div
        className={`text-block${activeClass}`}
        style={{
          fontFamily: block.format?.textFont ?? page.format?.textFont ?? format.textFont,
          color: block.format?.textColor ?? page.format?.textColor ?? format.textColor,
        }}
      >
        <div onClick={onClick}>{block.content}</div>
      </div>
    );
  }

  if (block.type === 'choice') {
    return <ButtonChoice className={activeClass} choice={block} onClick={onClick} />;
  }

  return <div className="render-block">not managed</div>;
}
