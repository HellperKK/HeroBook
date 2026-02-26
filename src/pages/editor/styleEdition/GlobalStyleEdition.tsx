import type { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Label from '../../../components/texts/label/Label';
import { changeGlobalFormat } from '../../../store/projectSlice';
import type { RootState } from '../../../store/store';
import type { Format } from '../../../utils/game/Format';

type Props = {
  children: (data: { value: string; onChange: (value: string) => void }) => ReactElement;
  label: string;
  property: keyof Format;
};

export default function GlobalStyleEdition({ children, label, property }: Props) {
  const {
    settings: { format },
  } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();
  return (
    <div>
      <Label width="110px">{label}</Label>
      {children({
        value: format[property],
        onChange: (value) =>
          dispatch(
            changeGlobalFormat({
              [property]: value,
            }),
          ),
      })}
    </div>
  );
}
