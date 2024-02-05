import Box from "@mui/system/Box";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ejs from "ejs";

import { RootState } from "../store/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Choice, SaveState, } from "../utils/initialStuff";
import { evalCondition, safeMarkdown } from "../utils/utils";
import StyledImg from "../components/game/StyledImg";
import { css } from "@emotion/css";
import { Jinter } from "jintr";
import StyledButton from "../components/game/StyledButton";
import { Button, Container, Dialog, Modal, Typography } from "@mui/material";

interface Props {
  loaded: boolean
}

export default function Player(props: Props) {
  const navigate = useNavigate();
  const { game, assets } = useSelector((state: RootState) => state.game);
  const state = useSelector((state: RootState) => state.playerState);
  const { loaded } = props

  const { id } = useParams();

  const selectedPage = game.pages.find(page => page.id === parseInt(id!, 10));
  const gameState = useMemo(() => ({ $state: state ?? {} }), []);
  const [saving, setSaving] = useState(false);

  const saves = Array.from({ length: 4 }, (_item, index) => {
    const save = localStorage.getItem(`save_${index}`)

    if (save !== null) {
      return JSON.parse(save) as SaveState;
    }

    return save;
  })

  if (!selectedPage) {
    return <p>No page</p>
  }

  if (!loaded) {
    const jinter = new Jinter(selectedPage.script ?? "")
    jinter.scope.set("$state", gameState.$state);
    jinter.interpret();
  }

  const nextPage = (id: number) => {
    if (id === 0) {
      navigate("/player/menu")
    }
    else {
      navigate(`/player/${id}`);
    }
  }

  const choiceButton = (choice: Choice, index: number) => {
    return (
      <StyledButton
        type="button"
        key={`poll_${index + 42}`}
        onClick={() => {
          nextPage(choice.pageId);
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
          <StyledButton
            type="button"
            onClick={() => {
              navigate("/player/menu")
            }}
            color={selectedPage.format.btnColor ?? game.format.btnColor}
          >
            Menu
          </StyledButton>
          {/*<StyledButton
            type="button"
            onClick={() => {
              setSaving(true);
            }}
            color={selectedPage.format.btnColor ?? game.format.btnColor}
          >
            Save
          </StyledButton>*/}
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
      <Dialog
        open={saving}
        onClose={() => setSaving(false)}
      >
        <Box sx={{ backgroundColor: 'white' }}>
          {saves.map((save, index) => {
            if (!save) {
              return (<Container>
                <Button
                  onClick={() => {
                    localStorage.setItem(`save_${index}`, JSON.stringify({ state: gameState.$state, pageId: parseInt(id!) }))
                    setSaving(false);
                  }}
                >
                  Save {index} empty
                </Button>
              </Container>)
            }

            return <Container>
              <Button
                onClick={() => {
                  localStorage.setItem(`save_${index}`, JSON.stringify({ state: gameState.$state, pageId: parseInt(id!) }))
                  setSaving(false);
                }}
              >
                Save {index}
              </Button>
            </Container>
          })}
          <Container>
            <Button
              onClick={() => {
                setSaving(false);
              }}
            >
              Quit
            </Button>
          </Container>
        </Box>
      </Dialog>
    </Box>
  );
}
