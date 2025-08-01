import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  title: string,
}>;

export default function TabPannel({ children, title }: Props) {
  return <div data-title={title} className="tab-pannel">{children}</div>
}