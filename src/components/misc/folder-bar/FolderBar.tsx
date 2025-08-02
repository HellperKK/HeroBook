import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { ignore } from "../../../utils/ignore";
import Button from "../../inputs/button/Button";
import File from "./File";
import Folder from "./Folder";

export default function FolderBar() {
	const { categories } = useSelector((state: RootState) => state.project);

	function handleDragEnd(event: DragEndEvent) {
		if (event.over) {
			const id = +event.active.id;
			const category = event.over.id.toString();
			console.log(id, category);

			//dispatch(changePageCategory({ pageId: id, category }));
		}
	}

	return (
		<div>
			<Button>Add category</Button>
			<DndContext onDragEnd={handleDragEnd}>
				{categories
					.filter((category) => category.name !== "no category")
					.map((category) => (
						<Folder key={category.name} name={category.name}>
							{category.pages.map((page) => (
								<File key={page.id} page={page} onClick={ignore} />
							))}
						</Folder>
					))}

				<Folder name="">
					{categories
						.find((category) => category.name === "no category")
						?.pages.map((page) => (
							<File key={page.id} page={page} onClick={ignore} />
						))}
				</Folder>
			</DndContext>
		</div>
	);
}
