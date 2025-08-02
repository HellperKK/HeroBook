import { useDroppable } from "@dnd-kit/core";
import { type PropsWithChildren, useState } from "react";
import Button from "../../inputs/button/Button";
import Label from "../../texts/label/Label";

type Props = PropsWithChildren<{
	name: string;
}>;

export default function Folder(props: Props) {
	const { name, children } = props;

	const [isOpen, setIsOpen] = useState(true);
	const icon = isOpen ? ">" : "<";
	const { setNodeRef, isOver } = useDroppable({
		id: name,
	});
	const trueName = name || "no category";

	const style = {
		backgroundColor: isOver ? "#888" : undefined,
	};

	return (
		<div>
			<div ref={setNodeRef} style={style}>
				<Button onClick={() => setIsOpen((isOpen) => !isOpen)}>{icon}</Button>
				<Label width="80px">{trueName}</Label>
				<Button disabled={name === ""}>Delete</Button>
				<Button>Add</Button>
			</div>
			{isOpen && <div>{children}</div>}
		</div>
	);
}
