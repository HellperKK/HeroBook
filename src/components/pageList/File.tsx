import { Button, Tooltip } from "@mui/material";
import { Page } from "../../utils/initialStuff";
import { useDraggable } from "@dnd-kit/core";
import DragIndicatorSharpIcon from '@mui/icons-material/DragIndicatorSharp';
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import { useNavigate } from "react-router-dom";
import Space from "../utils/Space";
import { css } from "@emotion/css";
import { useDispatch } from "react-redux";
import { removePage } from "../../store/gameSlice";
import StaticSpan from "../utils/staticSpan";

type Props = {
  page: Page;
  onClick: () => void
}

export default function File(props: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    border-left: 1px solid #888;
    margin-left: 30px;
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
      <StaticSpan width={90}>{page.name}</StaticSpan>
      <Tooltip title="delete page" arrow>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(removePage({removeId: page.id}));

              /*if (page === selectedPage) {
                const id = game.pages[0].id
                navigate(`/editor/${id}`)
              }*/
            }}
          >
            <DeleteSharpIcon />
          </Button>
        </Tooltip>
    </div>
  );
  //return <Button ref={setNodeRef} variant="contained" onClick={onClick}>{page.name}</Button>
}