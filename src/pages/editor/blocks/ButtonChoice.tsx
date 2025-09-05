import './buttonChoice.scss';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState } from '../../../store/store';
import type { ChoiceBlock } from '../../../utils/game/Block';

type Props = { choice: ChoiceBlock; onClick?: () => void; className?: string };

export default function ButtonChoice({ choice, onClick, className }: Props) {
  const params = useParams();
  const {
    pages,
    settings: { format },
  } = useSelector((state: RootState) => state.project);

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;

  return (
    <button
      className={`button-choice${className ?? ''}`}
      type="button"
      style={{
        backgroundColor: choice.format?.btnColor ?? page.format?.btnColor ?? format.btnColor,
        color: choice.format?.btnTextColor ?? page.format?.btnTextColor ?? format.btnTextColor,
        fontFamily: choice.format?.btnFont ?? page.format?.btnFont ?? format.btnFont,
      }}
      onClick={onClick}
    >
      {choice.text}
    </button>
  );
}
