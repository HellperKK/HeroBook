import type { ReactElement } from "react";
import { useDispatch } from "react-redux";
import Label from "../../../components/texts/label/Label";
import { changeGlobalFormat } from "../../../store/projectSlice";
import type { Format } from "../../../utils/game/Format";

type Props = {
	children: (data: {
		value: string;
		onChange: (value: string) => void;
	}) => ReactElement;
	label: string;
	value: Format;
	property: keyof Format;
};

export default function GlobalStyleEdition({
	children,
	label,
	value,
	property,
}: Props) {
	const dispatch = useDispatch();
	return (
		<div>
			<Label width="110px">{label}</Label>
			{children({
				value: value[property],
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
