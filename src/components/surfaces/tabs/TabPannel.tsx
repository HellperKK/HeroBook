import type { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  title: string,
  disabled?: boolean
}>;

export default function TabPannel({ children, title, disabled }: Props) {
  return <div data-title={title} data-disabled={disabled} className="tab-pannel">{children}</div>
}