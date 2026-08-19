import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import type { RootState } from '../../../store/store';
import type { ChoiceBlock } from '../../../utils/game/Block';
import { oppositeColorRGB } from '../../../utils/oppositeColorRGB';

type Props = {
  block: ChoiceBlock;
  onClick: () => void;
  active: boolean;
};

export default function ChoiceBlockComponent({ block, onClick, active }: Props) {
  const {
    pages,
    settings: { format },
  } = useSelector((state: RootState) => state.project.project);

  const params = useParams();

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;
  const pageColor = page.format?.page ?? format.page;

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
