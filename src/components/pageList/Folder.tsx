import { Button, Tooltip } from "@mui/material";
import { PropsWithChildren, useState } from "react";

import ChevronRightSharpIcon from '@mui/icons-material/ChevronRightSharp';
import NoteAddSharpIcon from '@mui/icons-material/NoteAddSharp';
import ExpandMoreSharpIcon from '@mui/icons-material/ExpandMoreSharp';
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { addPage, changePage } from "../../store/gameSlice";
import { css } from "@emotion/css";
import StaticSpan from "../utils/staticSpan";

type Props = PropsWithChildren<{
  name: string
}>;

export default function Folder(props: Props) {
  const { name, children } = props;
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(true);
  const icon = isOpen ? <ExpandMoreSharpIcon /> : <ChevronRightSharpIcon />
  const { setNodeRef, isOver } = useDroppable({
    id: name,
  });
  const trueName = name || "no category"


  const style = {
    backgroundColor: isOver ? '#888' : undefined,
  };

  return (
    <div>
      <div ref={setNodeRef} style={style}>
        <Button onClick={() => setIsOpen(isOpen => !isOpen)}>{icon}</Button>
        <StaticSpan width={100}>{trueName}</StaticSpan>
        <Tooltip title="add a page" arrow>
          <Button
            onClick={() =>
              dispatch(addPage(name))
            }
          >
            <NoteAddSharpIcon />
          </Button>
        </Tooltip>
      </div>
      {isOpen && <div>
        {children}
      </div>}
    </div>
  );
  return <div>
    <div>{name}</div>

  </div>
}