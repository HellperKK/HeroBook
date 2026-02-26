import { PropsWithChildren, ReactElement } from "react";

import "./dropDownBar.scss";

type Props = PropsWithChildren<{
    label: string;
    children: Array<ReactElement> | ReactElement;
}>

export default function DropDownBar({ children, label }: Props) {

    if (!(children instanceof Array)) {
        children = [children]
    }

    return (
        <div className="dropdown">
            <div className="tab tab-label">
                {label}
            </div>
            <div className="tab-rest">
                {children.map((child, index) => (<div key={index} className="tab tab-hidden">{child}</div>))}
            </div>
        </div>
    );
}
