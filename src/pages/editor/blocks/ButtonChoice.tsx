import "./buttonChoice.scss";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../../../store/store";
import type { Choice } from "../../../utils/game/Block";

type Props = { choice: Choice };

export default function ButtonChoice({ choice }: Props) {
	const params = useParams();
	const {
		pages,
		settings: { format },
	} = useSelector((state: RootState) => state.project);

	// biome-ignore lint/style/noNonNullAssertion: will allways work
	const page = pages.find((page) => page.id === +params.id!)!;

	return (
		<button
			className="button-choice"
			type="button"
			style={{
				backgroundColor:
					choice.format?.btnColor ?? page.format?.btnColor ?? format.btnColor,
				color:
					choice.format?.btnTextColor ??
					page.format?.btnTextColor ??
					format.btnTextColor,
			}}
		>
			{choice.text}
		</button>
	);
}
