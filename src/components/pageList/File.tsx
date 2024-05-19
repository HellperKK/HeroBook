import { Button } from "@mui/material";
import { Page } from "../../utils/initialStuff";
import { useDraggable } from "@dnd-kit/core";
import DragIndicatorSharpIcon from '@mui/icons-material/DragIndicatorSharp';
import { useNavigate } from "react-router-dom";
import Space from "../utils/Space";
import { css } from "@emotion/css";

type Props = {
  page: Page;
  onClick: () => void
}

export default function File(props: Props) {
  const navigate = useNavigate();
  const { page, onClick } = props;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: page.id.toString(),
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const className = css`
    transform: ${transform && `translate3d(${transform.x}px, ${transform.y}px, 0)`};
    cursor: pointer;
  `

  return (
    <div ref={setNodeRef} className={className} onClick={() => navigate(`/editor/${page.id}`)}>
      <button {...listeners} {...attributes} className={css`
        border: none;
        cursor: pointer;
        background-color: transparent;
      `}>
        <DragIndicatorSharpIcon />
      </button>
      <Space size={2} />
      {page.name}
    </div>
  );
  //return <Button ref={setNodeRef} variant="contained" onClick={onClick}>{page.name}</Button>
}