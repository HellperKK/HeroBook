import { type PropsWithChildren, useEffect, useRef } from "react";
import Button from "../../inputs/button/Button";
import "./modal.scss"

type Props = PropsWithChildren<{
  title: string,
  open: boolean,
  onClose: () => void,
  className?: string,
}>;

export default function Modal({ children, onClose, open, title, className }: Props) {
  const ref = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    if (open) {
      ref.current.showModal();
    }
    else {
      ref.current.close()
    }
  }, [open])

  return <dialog
    ref={ref}
    className={`modal ${className ?? ""}`}
    onClose={(e) => {
      e.preventDefault;
      onClose();
    }
    }>
    <div className="modal-title-bar">
      <div className="modal-title">
        {title}
      </div>
      <div>
        <Button className="modal-quit" onClick={onClose}>
          X
        </Button>
      </div>
    </div>
    <hr />
    {children}
  </dialog >
}