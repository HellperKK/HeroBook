import type { Block } from '../../../utils/game/Block';
import './renderBlock.scss';
import TextualBlock from './TextBlockComponent';
import ChoiceBlockComponent from './ChoiceBlockComponent';
import ImageBlockComponent from './ImageBlockComponent';

type Props = {
  block: Block;
  onClick: () => void;
  active: boolean;
};

export default function RenderBlock({ block, onClick, active }: Props) {
  if (block.type === 'text') {
    return <TextualBlock block={block} onClick={onClick} active={active} />;
  }

  if (block.type === 'choice') {
    return <ChoiceBlockComponent block={block} onClick={onClick} active={active} />;
  }

  if (block.type === 'image') {
    return <ImageBlockComponent block={block} onClick={onClick} active={active} />;
  }

  return <div className="render-block">not managed</div>;
}
