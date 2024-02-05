import { useSelector } from "react-redux";

import { RootState } from "../store/store";
import { Link, useNavigate } from "react-router-dom";
import { initialTexts } from "../utils/initialStuff";
import { css } from "@emotion/css";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";

export default function PlayerMenu() {
  const navigate = useNavigate();
  const { game } = useSelector((state: RootState) => state.game);

  return (
    <div>
      <Container>
        <Link to={`/editor/${game.pages[0].id}`}>Back to editor</Link>
      </Container>
      <div
        className={css`
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          `}
      >
        <Button
          onClick={() => {
            const firstPage = game.pages.find(page => page.isFirst)

            if (firstPage) {
              navigate(`/player/${firstPage.id}`)
            }
          }}
        >
          {game.settings.texts?.play ?? initialTexts.play}
        </Button>
        {/*<Button
          onClick={() => {navigate("/player/load") }}
          disabled={false}
        >
          {game.settings.texts?.continue ?? initialTexts.continue}
        </Button>*/}
        <Button
          onClick={() => {
            const firstPage = game.pages[0]

            if (firstPage) {
              navigate(`/editor/${firstPage.id}`)
            }
          }}
        >
          {game.settings.texts?.quit ?? initialTexts.quit}
        </Button>
      </div>
    </div>)
}
