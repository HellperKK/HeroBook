import { PropsWithChildren, ReactNode } from "react";
import "./buttonGroup.scss"
import { separate } from "../../../utils/separate";
import Separator from "../../misc/separator/Separator";

type Props = PropsWithChildren<{}>;

export default function ButtonGroup({children}: Props) {
  let newChildren: Array<ReactNode>;
  if (children instanceof Array) {
    newChildren = children.slice();
  }
  else {
    newChildren = [children];
  }

  return <div className="button-group">{separate(newChildren, () => <Separator />)}</div>
}