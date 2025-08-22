import type { Block } from "../../../utils/game/Block";
import ButtonChoice from "./ButtonChoice";

type Props = {
	block: Block;
};

export default function RenderBlock({ block }: Props) {
    if (block.type === "text") {
        return <div>{block.content}</div>
    }

    if (block.type === "choice") {
        return <ButtonChoice choice={block} />
    }

	return <div className="render-block">not managed</div>;
}
