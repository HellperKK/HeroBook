import Box from "@mui/system/Box";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ejs from "ejs";

import { RootState } from "../store/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Choice, SaveState, initialTexts, } from "../utils/initialStuff";
import { evalCondition, safeMarkdown } from "../utils/utils";
import StyledImg from "../components/game/StyledImg";
import { css } from "@emotion/css";
import { Jinter } from "jintr";
import StyledButton from "../components/game/StyledButton";
import { Button, Container, Dialog } from "@mui/material";

interface Props {
  loaded: boolean
}

interface AudioInfo {
  name: string,
  audio: HTMLAudioElement,
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
  const [audioInfo, setAudioInfo] = useState<AudioInfo | null>(null);

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
      if (audio) {
        audio.pause()
      }
      if (audioInfo) {
        audioInfo.audio.pause();
      }
      navigate("/player/menu")
    }
    else {
      navigate(`/player/${id}`);
    }
  }

  let body = safeMarkdown(selectedPage.text);

  const image = assets.images.find(image => image.name === selectedPage.image)

  const audioAsset = assets.musics.find(music => music.name === selectedPage.audio)

  let audio: HTMLAudioElement | null = null;
  if (audioAsset && ((audioInfo && audioInfo.name !== audioAsset.name) || !audioInfo || audioInfo.name === "no-music")) {
    if (audioInfo) {
      audioInfo.audio.pause();
    }
    audio = new Audio(audioAsset.content);
    audio.loop = true;
    audio.play();
  }

  if (selectedPage.audio === "no-music" && audioInfo) {
    audioInfo.audio.pause();
  }

  const soundAsset = assets.sounds.find(sound => sound.name === selectedPage.sound)

  if (soundAsset) {
    audio = new Audio(soundAsset.content);
    audio.loop = false;
    audio.play();
  }

  const choiceButton = (choice: Choice, index: number) => {
    return (
      <StyledButton
        type="button"
        key={`poll_${index + 42}`}
        onClick={() => {
          if (audio) {
            setAudioInfo({ name: audioAsset?.name ?? "", audio })
          }
          else if(selectedPage.audio === "no-music") {
            setAudioInfo({ name: "no-music", audio: new Audio() })
          }
          nextPage(choice.pageId);
        }}
        color={selectedPage.format.btnColor ?? game.format.btnColor}
        dangerouslySetInnerHTML={{
          __html: safeMarkdown(` > ${choice.action}`),
        }}
      />
    );
  };

  try {
    body = safeMarkdown(ejs.render(selectedPage.text, gameState));
  } catch (error) { }

  return (
    <Box>
      <Container>
        <Link to={`/editor/${game.pages[0].id}`} onClick={() => {
          if (audio) {
            audio.pause()
          }
          if (audioInfo) {
            audioInfo.audio.pause();
          }
        }}>Back to editor</Link>
      </Container>
      <Box
        sx={{
          padding: "10%",
          minHeight: "50vh",
          backgroundColor: selectedPage.format.background ?? game.format.background,
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
              if (audio) {
                audio.pause()
              }
              if (audioInfo) {
                audioInfo.audio.pause();
              }
              navigate("/player/menu")
            }}
            color={selectedPage.format.btnColor ?? game.format.btnColor}
          >
            {game.settings.texts?.menu || initialTexts.menu}
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
              justifyContent: "center",
              alignItems: "center",
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
