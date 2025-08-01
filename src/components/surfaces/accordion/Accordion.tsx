import { PropsWithChildren, useState } from "react";
import "./accordion.scss"

type Props = PropsWithChildren<{
    label: string,
}>

export default function Accordion({ label, children }: Props) {
    const [isActive, setIsActive] = useState(false);

    const icon = isActive ? ">" : "v";

    return (<div className="accordion">
        <div className="accordion-title" onClick={() => setIsActive(active => !active)}>
            {icon} {label}
        </div>
        {isActive && <div className="accordion-body">
            {children}
        </div>}
    </div>);
}