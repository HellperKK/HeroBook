import type { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/inputs/button/Button';
import Label from '../../../components/texts/label/Label';
import { changePageFormat } from '../../../store/projectSlice';
import type { RootState } from '../../../store/store';
import type { Format } from '../../../utils/game/Format';
import type { Page } from '../../../utils/game/Page';

type Props = {
  children: (data: { value: string; onChange: (value: string) => void }) => ReactElement;
  label: string;
  page: Page;
  property: keyof Format;
};

export default function PageStyleEdition({ children, label, page, property }: Props) {
  const {
    settings: { format },
  } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();
  return (
    <div>
      <Label width="110px">{label}</Label>
      {children({
        value: page.format[property] ?? format[property],
        onChange: (value) =>
          dispatch(
            changePageFormat({
              pageId: page.id,
              format: {
                [property]: value,
              },
            }),
          ),
      })}
      <Button
        disabled={!page.format[property]}
        onClick={() =>
          dispatch(
            changePageFormat({
              pageId: page.id,
              format: {
                [property]: undefined,
              },
            }),
          )
        }
      >
        Reset
      </Button>
    </div>
  );
}
