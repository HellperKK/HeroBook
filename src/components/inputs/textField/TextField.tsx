import type { HTMLInputTypeAttribute } from 'react';
import { ignore } from '../../../utils/ignore';
import './textField.scss';

type Props = {
  onChange?: (value: string) => void;
  value: string;
  type?: HTMLInputTypeAttribute;
  className?: string;
  required?: boolean;
};

export default function TextField(props: Props) {
  const { onChange, value, className, type, required } = Object.assign(
    { type: 'text', className: '', onChange: ignore },
    props,
  );

  return (
    <input
      type={type}
      value={value}
      required={required}
      className={`text-field ${className}`}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
