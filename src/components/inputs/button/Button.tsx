import type { PropsWithChildren } from "react";
import { useContext, useState } from "react";
import "./button.scss";
import SettingsContext from "../../../utils/contexts/settingsContext";
import { ignore } from "../../../utils/ignore";

type Props = PropsWithChildren<{
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	className?: string;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
}>;

export default function Button({ children, onClick, className, type, disabled }: Props) {
	const context = useContext(SettingsContext);
	const [isDisabled, setIsDisabled] = useState(false);

	return (
		<button
			type={type ?? "button"}
			disabled={disabled ||isDisabled}
			className={`button ${className ?? ""}`}
			onClick={(e) => {
				if (!isDisabled) {
					(onClick ?? ignore)(e);
					setIsDisabled(() => true);
					setTimeout(() => setIsDisabled(() => false), context.clickDelay);
				}
			}}
		>
			{children}
		</button>
	);
}
