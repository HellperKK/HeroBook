import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate, useParams } from "react-router-dom";
import Folder from "./pageList/Folder";
import File from "./pageList/File";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { addCategory, addPage, changePage } from "../store/gameSlice";
import { Button, Tooltip } from "@mui/material";
import CreateNewFolderSharpIcon from '@mui/icons-material/CreateNewFolderSharp';
import NoteAddSharpIcon from '@mui/icons-material/NoteAddSharp';

export default function PageFolder() {
  const { game, expert } = useSelector((state: RootState) => state.game);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedPage = game.pages.find(page => page.id === parseInt(id!, 10))!;

  const categories = game.settings.categories ?? [];



  function handleDragEnd(event: DragEndEvent) {
    if (event.over) {
      const id = +event.active.id;
      const category = event.over.id.toString();

      dispatch(changePage({ pageId: id, page: { category } }));
    }
  }

  return (
    <div>
      <Tooltip title="add a cateogry" arrow>
        <Button
          variant="contained"
          onClick={() =>
            dispatch(addCategory())
          }
        >
          <CreateNewFolderSharpIcon />
        </Button>
      </Tooltip>
      <DndContext onDragEnd={handleDragEnd}>
        {categories.map(category => (
          <Folder name={category.name}>
            {game.pages.filter(page => page.category === category.name).map(page => (
              <File page={page} onClick={() => navigate(`/editor/${page.id}`)} />
            ))}
          </Folder>
        ))}

        <Folder name="">
          {game.pages.filter(page => page.category === "" || page.category === undefined).map(page => (
            <File page={page} onClick={() => navigate(`/editor/${page.id}`)} />
          ))}
        </Folder>
      </DndContext>
    </div>
  )
}