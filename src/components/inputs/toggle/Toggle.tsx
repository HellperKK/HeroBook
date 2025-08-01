import { ignore } from "../../../utils/ignore";
import "./toggle.scss";

type Props = {
	checked: boolean;
	onChange?: (value: boolean) => void;
};

export default function Toggle({ checked, onChange }: Props) {
	return (
		<label className="toggle">
			<input type="checkbox" checked={checked} onChange={(e) => (onChange ?? ignore)(e.target.checked)}/>
			<span className="toggle-slider"></span>
		</label>
	);
}
