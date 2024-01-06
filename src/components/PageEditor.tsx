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

import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { useState } from "react";

import {  noExt } from "../utils/utils";
import { findPage } from "../utils/page";

import Space from "./utils/Space";
import { Asset, addAssets, addChoice, changeChoice, changePage, removeChoice } from "../store/gameSlice";
import { RootState } from "../store/store";
import CodeEditor from "./codeEditor/CodeEditor";
import { loadAssets } from "../utils/assets";
import { useParams } from "react-router-dom";
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
          dispatch(changePage({ page: {image: newAssets[0].name}, pageId: selectedPage.id }))

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
        Category
        <Space size={2} />
        <Select value={selectedPage.category ?? ""}>
          <MenuItem
            value=""
            onClick={() =>
              dispatch(changePage({ page: { category: "" }, pageId: selectedPage.id }))
            }
          >
            <Typography>No category</Typography>
          </MenuItem>
          {categories.map((category, index) => (
            <MenuItem
              key={`category${index + 42}`}
              value={category.name}
              onClick={() =>
                dispatch(changePage({ page: { category: category.name }, pageId: selectedPage.id }))
              }
            >
              <Typography>{category.name}</Typography>
            </MenuItem>
          ))}
        </Select>
        <Space size={2} />
        <Tooltip title="page illustration" arrow><PermMediaSharpIcon /></Tooltip>
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
        <Typography>{draging ? "drag images here" : ""}</Typography>
      </Box>
      <Box sx={{ paddingTop: "20px" }}>
        <Typography>Page content:</Typography>
        {<CodeEditor content={selectedPage.text} onUpdate={(content) => {
          if (content !== selectedPage.text) {
            dispatch(changePage({ page: { text: content }, pageId: selectedPage.id }));
          }
        }} />}
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
                    console.log(e.target.value);
                    dispatch(changeChoice({ choice: { action: e.target.value }, position: index, pageId: selectedPage.id }));
                  }
                  }
                />
                <Space size={2} />
                <Select
                  value={findPage(game.pages, choice.pageId).id}
                  sx={{ width: "30%" }}
                >
                  {game.pages.map((pa) => (
                    <MenuItem
                      key={pa.id}
                      value={pa.id}
                      onClick={() =>
                        dispatch(changeChoice({ choice: { pageId: pa.id }, position: index, pageId: selectedPage.id }))
                      }
                    >
                      {pa.name}
                    </MenuItem>
                  ))}
                </Select>
                <Space size={2} />
                <TextField
                  label="Choice Condition"
                  variant="outlined"
                  value={choice.condition ?? ""}
                  sx={{ width: "50%" }}
                  onChange={(e) =>
                    dispatch(changeChoice({ choice: { condition: e.target.value }, position: index, pageId: selectedPage.id }))
                  }
                />
                <Space size={2} />
                <Button
                  variant="contained"
                  onClick={() =>
                    dispatch(removeChoice({pageId: selectedPage.id, choiceIndex: index}))
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
                  dispatch(addChoice({pageId: selectedPage.id}))
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
