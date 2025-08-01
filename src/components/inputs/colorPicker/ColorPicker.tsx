import { PropsWithChildren } from "react";
import "./colorPicker.scss"

type Props = {
  className?: string,
  value: string;
  onChange: (value: string) => void
};

export default function ColorPicker({ onChange, value, className}:Props) {
  return <input type="color" value={value} className={`color-picker ${className ?? ""}`} onChange={e => onChange(e.target.value)}/>;
}