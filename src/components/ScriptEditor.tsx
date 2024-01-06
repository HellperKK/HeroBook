import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../store/store";
import { Typography } from "@mui/material";
import JsCodeEditor from "./jsCodeEditor/JsCodeEditor";
import { changePage } from "../store/gameSlice";

export default function ScriptEditor() {
  const { id } = useParams();
  const { game } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const selectedPage = game.pages.find(page => page.id === parseInt(id!, 10))!;
  return <div>
    <Typography>Script content:</Typography>
        {<JsCodeEditor content={selectedPage.script ?? ""} onUpdate={(content) => {
          if (content !== selectedPage.script) {
            dispatch(changePage({ page: { script: content }, pageId: selectedPage.id }));
          }
        }} />}
  </div>
}