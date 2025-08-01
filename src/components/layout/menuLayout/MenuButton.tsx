import { MouseEventHandler, PropsWithChildren } from "react";
import "./menuButton.scss"

type Props = PropsWithChildren<{
    onClick?: MouseEventHandler<HTMLButtonElement>
}>

export default function MenuButton({children, onClick}: Props) {
    return <button onClick={onClick} className="menu-button">{children}</button>
}