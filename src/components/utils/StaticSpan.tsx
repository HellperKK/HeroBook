import { css } from "@emotion/css";
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  width: number
}>

export default function StaticSpan(props:Props) {
  const {width, children} = props;
  return (<span className={css`
    display: inline-block;
    width: ${width}px;
  `}>
    {children}
  </span>)
}