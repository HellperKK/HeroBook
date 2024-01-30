import Box from "@mui/system/Box";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import ejs from "ejs";

import { addCategory, addPage, changeCategory, removeCategory, removePage, setFirst } from "../store/gameSlice";
import { RootState } from "../store/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Choice, Page, initialTexts } from "../utils/initialStuff";
import ScriptEditor from "../components/ScriptEditor";
import { evalCondition, safeMarkdown } from "../utils/utils";
import StyledImg from "../components/game/StyledImg";
import { css } from "@emotion/css";
import { Jinter } from "jintr";
import StyledButton from "../components/game/StyledButton";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";

export default function Player() {
  const navigate = useNavigate();
  const { game, assets } = useSelector((state: RootState) => state.game);

  const { id } = useParams();

  const selectedPage = game.pages.find(page => page.id === parseInt(id!, 10));
  const gameState = useMemo(() => ({ $state: {} }), []);

  if (parseInt(id!, 10) === 0) {
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
          <Button
            onClick={() => { }}
            disabled={false}
          >
          {game.settings.texts?.continue ?? initialTexts.continue}
          </Button>
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

  if (!selectedPage) {
    return <p>No page</p>
  }

  const jinter = new Jinter(selectedPage.script ?? "")
  jinter.scope.set("$state", gameState.$state);
  jinter.interpret();


  const choiceButton = (choice: Choice, index: number) => {
    return (
      <StyledButton
        type="button"
        key={`poll_${index + 42}`}
        onClick={() => {
          console.log(choice.pageId);
          navigate(`/player/${choice.pageId}`);
        }}
        color={selectedPage.format.btnColor ?? game.format.btnColor}
        dangerouslySetInnerHTML={{
          __html: safeMarkdown(` > ${choice.action}`),
        }}
      />
    );
  };

  let body = safeMarkdown(selectedPage.text);
  const image = assets.images.find(image => image.name === selectedPage.image)

  try {
    body = safeMarkdown(ejs.render(selectedPage.text, gameState));
  } catch (error) { }

  return (
    <Box>
      <Container>
        <Link to={`/editor/${game.pages[0].id}`}>Back to editor</Link>
      </Container>
      <Box
        sx={{
          padding: "10%",
          minHeight: "50vh",
          backgroundColor: selectedPage.format.background ?? game.format.background,
          overflowX: "auto",
        }}
      >
        <Box
          className="story"
          sx={{
            height: "100%",
            padding: "8px",
            backgroundColor: selectedPage.format.page ?? game.format.page,
            color: selectedPage.format.textColor ?? game.format.textColor,
          }}
        >
          <div
            className={css`
            text-align: center;
          `}
          >
            <StyledImg src={image?.content} alt="" />
          </div>
          <p
            className="story-text"
            dangerouslySetInnerHTML={{
              __html: safeMarkdown(body),
            }}
          />
          <Box
            className="story"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {selectedPage.next.filter((choice: Choice) => {
              const condition = choice.condition;
              return condition === undefined || condition === "" || evalCondition(gameState.$state, condition)
            }).map(choiceButton)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
