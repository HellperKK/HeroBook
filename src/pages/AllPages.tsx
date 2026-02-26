import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store/store";
import { Link, useNavigate } from "react-router-dom";
import { initialTexts } from "../utils/initialStuff";
import { css } from "@emotion/css";
import { Container, Typography } from "@mui/material";
import StyledButton from '../components/game/StyledButton'
import CodeEditor from "../components/codeEditor/CodeEditor";
import { changePage } from "../store/gameSlice";
import { countWords } from "../utils/countWords";

export default function AllPages() {
  const navigate = useNavigate();
  const { game } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  return (
    <div className={css`background-color: white`}>
      <Container>
        <Link to={`/editor/${game.pages[0].id}`}>Back to editor</Link>
      </Container>
      {game.pages.map(page =>
        <>
          <Typography>{page.name}</Typography>
          <CodeEditor content={page.text} onUpdate={(content) => {
            if (content !== page.text) {
              dispatch(changePage({ page: { text: content }, pageId: page.id }));
            }
          }} />
          <div>Page count: {page.text.length} chars and about {countWords(page.text)} words</div>
        </>
      )}
    </div>)
}
