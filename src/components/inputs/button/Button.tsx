import type { PropsWithChildren } from "react";
import { useContext, useState } from "react";
import "./button.scss";
import SettingsContext from "../../../utils/contexts/settingsContext";

type Props = PropsWithChildren<{
	onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	className?: string;
}>;

export default function Button({ children, onClick, className }: Props) {
	const context = useContext(SettingsContext);
	const [isDisabled, setIsDisabled] = useState(false);

	return (
		<button
			type="button"
			disabled={isDisabled}
			className={`button ${className ?? ""}`}
			onClick={(e) => {
				if (!isDisabled) {
					onClick(e);
					setIsDisabled(() => true);
					setTimeout(() => setIsDisabled(() => false), context.clickDelay);
				}
			}}
		>
			{children}
		</button>
	);
}
