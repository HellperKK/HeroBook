import type { ReactElement } from "react";
import { useDispatch } from "react-redux";
import Button from "../../../components/inputs/button/Button";
import Label from "../../../components/texts/label/Label";
import { changePageFormat, clearPageFormat } from "../../../store/projectSlice";
import type { Format } from "../../../utils/game/Format";
import type { Page } from "../../../utils/game/Page";

type Props = {
	children: (data: {
		value: string;
		onChange: (value: string) => void;
	}) => ReactElement;
	label: string;
	page: Page;
	value: Format;
	property: keyof Format;
};

export default function PageStyleEdition({
	children,
	label,
	page,
	property,
	value,
}: Props) {
	const dispatch = useDispatch();
	return (
		<div>
			<Label width="110px">{label}</Label>
			{children({
				value: page.format[property] ?? value[property],
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
						clearPageFormat({
							pageId: page.id,
							property,
						}),
					)
				}
			>
				Reset
			</Button>
		</div>
	);
}
