import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem/ListItem";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import AddSharpIcon from "@mui/icons-material/AddSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import PermMediaSharpIcon from "@mui/icons-material/PermMediaSharp";
import MusicNoteSharpIcon from '@mui/icons-material/MusicNoteSharp';

import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { useState } from "react";

import { noExt } from "../utils/utils";
import { findPage } from "../utils/page";

import Space from "./utils/Space";
import { Asset, addAssets, addChoice, changeChoice, changePage, removeChoice } from "../store/gameSlice";
import { RootState } from "../store/store";
import CodeEditor from "./codeEditor/CodeEditor";
import { loadAssets } from "../utils/assets";
import { useParams } from "react-router-dom";
import { countWords } from "../utils/countWords";
// import MarkdownEditor from './MarkdownEditor';

const StyledImg = styled.img`
  max-width: 80px;
  max-height: 40px;
`;

export default function PageEditor() {
  const { game, assets } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const [draging, setDraging] = useState(false);
  const categories = game.settings.categories ?? [];
  const { id } = useParams();
  const selectedPage = game.pages.find(page => page.id === parseInt(id!, 10))!;
  const { length: globalTextLength, words: globalWordCount } = game.pages.reduce((memo, page) => {
    memo.length += page.text.length;
    memo.words += countWords(page.text);
    return memo;
  }, { length: 0, words: 0 })

  return (
    <Box
      sx={{
        height: "calc(100vh - 120px)",
        display: "grid",
        gridTemplateRows: "100px 1fr 400px",
      }}
    >
      <Box
        sx={{
          height: "calc(10vh-20px)",
          paddingTop: "20px",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDraging(true);
        }}
        onDragLeave={() => {
          setDraging(false);
        }}
        onDrop={async (e) => {
          e.preventDefault();

          const arrFiles = Array.from(e.dataTransfer.files);
          const newAssets = await loadAssets(arrFiles);

          dispatch(addAssets({ assets: newAssets, type: "images" }));
          dispatch(changePage({ page: { image: newAssets[0].name }, pageId: selectedPage.id }))

          setDraging(false);
        }}
      >
        <TextField
          label="Page Title"
          variant="outlined"
          value={selectedPage.name}
          onChange={(e) =>
            dispatch(changePage({ page: { name: e.target.value }, pageId: selectedPage.id }))
          }
        />
        <Space size={2} />
        Illustration
        <Space size={2} />
        <Select value={selectedPage.image}>
          {assets.images.map((image) => (
            <MenuItem
              key={image.name}
              value={image.name}
              onClick={() =>
                dispatch(changePage({ page: { image: image.name }, pageId: selectedPage.id }))
              }
            >
              <StyledImg src={image.content} alt="" />
              <Space size={2} />
              <Typography sx={{ display: "inline-block" }}>{noExt(image.name)}</Typography>
            </MenuItem>
          ))}
        </Select>
        <Space size={2} />
        <Button
          disabled={!selectedPage.image}
          variant="contained"
          onClick={() =>
            dispatch(changePage({ page: { image: undefined }, pageId: selectedPage.id }))
          }
        >
          <DeleteSharpIcon />
        </Button>
        <Space size={2} />
        Music
        <Space size={2} />
        <Select value={selectedPage.audio}>
          <MenuItem
            key="no-music"
            value="no-music"
            onClick={() =>
              dispatch(changePage({ page: { audio: "no-music" }, pageId: selectedPage.id }))
            }
          >
            <Typography sx={{ display: "inline-block" }}>silence</Typography>
          </MenuItem>
          {assets.musics.map((music) => (
            <MenuItem
              key={music.name}
              value={music.name}
              onClick={() =>
                dispatch(changePage({ page: { audio: music.name }, pageId: selectedPage.id }))
              }
            >
              <Typography sx={{ display: "inline-block" }}>{noExt(music.name)}</Typography>
            </MenuItem>
          ))}
        </Select>
        <Space size={2} />
        <Button
          disabled={!selectedPage.audio}
          variant="contained"
          onClick={() =>
            dispatch(changePage({ page: { audio: undefined }, pageId: selectedPage.id }))
          }
        >
          <DeleteSharpIcon />
        </Button>
        Sound
        <Space size={2} />
        <Select value={selectedPage.sound}>
          {assets.sounds.map((sound) => (
            <MenuItem
              key={sound.name}
              value={sound.name}
              onClick={() =>
                dispatch(changePage({ page: { sound: sound.name }, pageId: selectedPage.id }))
              }
            >
              <Typography sx={{ display: "inline-block" }}>{noExt(sound.name)}</Typography>
            </MenuItem>
          ))}
        </Select>
        <Space size={2} />
        <Button
          disabled={!selectedPage.sound}
          variant="contained"
          onClick={() =>
            dispatch(changePage({ page: { sound: undefined }, pageId: selectedPage.id }))
          }
        >
          <DeleteSharpIcon />
        </Button>
        <Space size={2} />
        <Typography>{draging ? "drag images here" : ""}</Typography>
      </Box>
      <Box sx={{ paddingTop: "20px" }}>
        <Typography>Page content:</Typography>
        {<CodeEditor content={selectedPage.text} onUpdate={(content) => {
          if (content !== selectedPage.text) {
            dispatch(changePage({ page: { text: content }, pageId: selectedPage.id }));
          }
        }} />}
        <div>Page count: {selectedPage.text.length} chars and about {countWords(selectedPage.text)} words</div>
        <div>Global count: {globalTextLength} chars and about {globalWordCount} words</div>
      </Box>
      {/* Choice List */}
      <Box
      >
        <Container sx={{ overflowY: "scroll", height: "35vh" }}>
          <List>
            {selectedPage.next.map((choice, index) => (
              <ListItem key={`choice-${index + 42}`}>
                <TextField
                  label="Choice Text"
                  variant="outlined"
                  value={choice.action}
                  sx={{ width: "50%" }}
                  onChange={(e) => {
                    dispatch(changeChoice({ choice: { action: e.target.value }, position: index, pageId: selectedPage.id }));
                  }
                  }
                />
                <Space size={2} />
                <Select
                  value={selectedPage.next[index].pageId}
                  sx={{ width: "30%" }}
                  onChange={(e) => {
                    dispatch(changeChoice({ choice: { pageId: +e.target.value }, position: index, pageId: selectedPage.id }))
                  }}
                >
                  <MenuItem
                    key={0}
                    value={0}
                  >
                    game menu
                  </MenuItem>
                  {game.pages.map((pa) => (
                    <MenuItem
                      key={pa.id}
                      value={pa.id}
                    >
                      {pa.name}
                    </MenuItem>
                  ))}
                </Select>
                <Space size={2} />
                {game.settings.expert &&
                  <TextField
                    label="Choice Condition"
                    variant="outlined"
                    value={choice.condition ?? ""}
                    sx={{ width: "50%" }}
                    onChange={(e) =>
                      dispatch(changeChoice({ choice: { condition: e.target.value }, position: index, pageId: selectedPage.id }))
                    }
                  />}
                <Space size={2} />
                <Button
                  variant="contained"
                  onClick={() =>
                    dispatch(removeChoice({ pageId: selectedPage.id, choiceIndex: index }))
                  }
                >
                  <DeleteSharpIcon />
                </Button>
              </ListItem>
            ))}
            <ListItem>
              <Button
                variant="contained"
                onClick={() =>
                  dispatch(addChoice({ pageId: selectedPage.id }))
                }
                sx={{ width: "85%" }}
              >
                <AddSharpIcon />
              </Button>
            </ListItem>
          </List>
        </Container>
      </Box>
    </Box>
  );
}
