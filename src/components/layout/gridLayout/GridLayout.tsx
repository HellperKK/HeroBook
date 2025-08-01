import { PropsWithChildren } from "react";

import "./gridLayout.scss";

type Props = PropsWithChildren<{
  columns: number;
  rows: number;
  className?: string
}>;

export default function GridLayout({ children, columns, rows, className }: Props) {
  const gridTemplateColumns = `repeat(${columns}, 1fr)`;
  const gridTemplateRows = `repeat(${rows}, 1fr)`;
  const style = {
    gridTemplateColumns,
    gridTemplateRows,
  }
  return <div style={style} className={`grid-layout ${className ?? ""}`} >{children}</div>;
}