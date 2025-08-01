import "./range.scss";

type Props = {
	onChange: (value: number) => void;
	value: number;
	className?: string;
	min?: number;
	max?: number;
	step?: number;
};

export default function Range({ onChange, value, className, min, max, step }: Props) {
	return (
		<input
			type="range"
			min={min}
			max={max}
            step={step}
			className={`range ${className ?? ""}`}
			value={value}
			onChange={(e) => onChange(e.target.valueAsNumber)}
		/>
	);
}
