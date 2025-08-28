import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../../../store/store";
import type { Block } from "../../../utils/game/Block";
import ButtonChoice from "./ButtonChoice";

type Props = {
	block: Block;
};

export default function RenderBlock({ block }: Props) {
	const params = useParams();
	const {
		pages,
		settings: { format },
	} = useSelector((state: RootState) => state.project);

	// biome-ignore lint/style/noNonNullAssertion: will allways work
	const page = pages.find((page) => page.id === +params.id!)!;

	if (block.type === "text") {
		return (
			<div
				style={{
					fontFamily:
						block.format?.textFont ?? page.format?.textFont ?? format.textFont,
					color:
						block.format?.textColor ??
						page.format?.textColor ??
						format.textColor,
				}}
			>
				{block.content}
			</div>
		);
	}

	if (block.type === "choice") {
		return <ButtonChoice choice={block} />;
	}

	return <div className="render-block">not managed</div>;
}
