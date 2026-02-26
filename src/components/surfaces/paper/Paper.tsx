import { ReactNode } from 'react';
import './paper.scss';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Paper({ children, className }: Props) {
  return (
    <div className={`paper ${className ?? ''}`}>
      {children}
    </div>
  );
}