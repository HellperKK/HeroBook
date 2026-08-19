import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../../../store/store";
import type { TextBlock } from "../../../utils/game/Block";
import { oppositeColorRGB } from "../../../utils/oppositeColorRGB";

type Props = {
  block: TextBlock;
  onClick?: () => void;
  active: boolean;
};

export default function TextBlockComponent({ block, onClick, active }: Props) {
  const {
    pages,
    settings: { format },
  } = useSelector((state: RootState) => state.project.project);

  const params = useParams();

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;
  const pageColor = page.format?.page ?? format.page;

  return (
        // biome-ignore lint/a11y/noStaticElementInteractions: false positive
        // biome-ignore lint/a11y/useKeyWithClickEvents: false positive
        <div
          onClick={onClick}
          className={`text-block`}
          style={{
            border: active ? `3px solid ${oppositeColorRGB(pageColor)}` : 'none',
          }}
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