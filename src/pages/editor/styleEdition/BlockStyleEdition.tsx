import type { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/inputs/button/Button';
import Label from '../../../components/texts/label/Label';
import { changeBlockFormat } from '../../../store/projectSlice';
import type { RootState } from '../../../store/store';
import type { Format } from '../../../utils/game/Format';
import type { Page } from '../../../utils/game/Page';

type Props = {
  children: (data: { value: string; onChange: (value: string) => void }) => ReactElement;
  label: string;
  page: Page;
  blockPosition: number;
  property: keyof Format;
};

export default function BlockStyleEdition({ children, label, page, property, blockPosition }: Props) {
  const {
    settings: { format },
  } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();
  const block = page.content[blockPosition];
  return (
    <div>
      <Label width="110px">{label}</Label>
      {children({
        value: block.format[property as keyof typeof block.format] ?? page.format[property] ?? format[property],
        onChange: (value) =>
          dispatch(
            changeBlockFormat({
              pageId: page.id,
              format: {
                [property]: value,
              },
              blockPosition,
            }),
          ),
      })}
      <Button
        disabled={!block.format[property as keyof typeof block.format]}
        onClick={() =>
          dispatch(
            changeBlockFormat({
              pageId: page.id,
              format: {
                [property]: undefined,
              },
              blockPosition,
            }),
          )
        }
      >
        Reset
      </Button>
    </div>
  );
}
