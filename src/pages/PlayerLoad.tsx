import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store/store";
import { Link, useNavigate } from "react-router-dom";
import { SaveState, initialTexts } from "../utils/initialStuff";
import { css } from "@emotion/css";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { changeState } from "../store/playSlice";

export default function PlayerLoad() {
  const navigate = useNavigate();
  const { game } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const saves = Array.from({length:4}, (_item, index) => {
    const save = localStorage.getItem(`save_${index}`)

    if (save !== null) {
      return JSON.parse(save) as SaveState;
    }

    return save;
  })

  return (
    <div>
      <Container>
        <Link to={`/player/menu`}>Back to menu</Link>
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
            const firstPage = game.pages[0]

            if (firstPage) {
              navigate(`/player/menu`)
            }
          }}
        >
          Back to menu
        </Button>
        {saves.map((save, index) => {
          if (!save) {
            return (<Button>
              Save {index} empty
            </Button>)
          }

          return <Button
            onClick={() => {
              dispatch(changeState(save.state));
              navigate(`/playerLoad/${save.pageId}`);
            }}
          >
            Save {index}
          </Button>
        })}
      </div>
    </div>)
}
