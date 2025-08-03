import { useDraggable } from "@dnd-kit/core";
import type { Page } from "../../../utils/game/Page";
import { ignore } from "../../../utils/ignore";
import Button from "../../inputs/button/Button";
import Label from "../../texts/label/Label";

type Props = {
	page: Page;
	onClick: () => void;
};

export default function File({ page }: Props) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: page.id.toString(),
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
				cursor: "pointer",
				borderLeft: "1px solid #888",
				marginLeft: "30px",
			}
		: undefined;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: can't do therwise
		// biome-ignore lint/a11y/useKeyWithClickEvents: wtf
		<div ref={setNodeRef} style={style} onClick={ignore}>
			<button
				{...listeners}
				{...attributes}
				style={{
					border: "none",
					cursor: "pointer",
					backgroundColor: "transparent",
				}}
			>
				::
			</button>
			<Label width="70px">{page.name}</Label>
			<Button>Delete</Button>
		</div>
	);
}
