import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem/ListItem";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import AddSharpIcon from "@mui/icons-material/AddSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import PermMediaSharpIcon from "@mui/icons-material/PermMediaSharp";

import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { useState } from "react";

import { assetPath, noExt, readImage } from "../utils/utils";
import { findPage } from "../utils/page";

import Space from "./utils/Space";
import { addAssets, addChoice, changeChoice, changePage, removeChoice } from "../store/gameSlice";
import { RootState } from "../store/store";
// import MarkdownEditor from './MarkdownEditor';

const StyledImg = styled.img`
  max-width: 80px;
  max-height: 40px;
`;

export default function PageEditor() {
  const { game, selectedPage, assets, zip } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const [draging, setDraging] = useState(false);
  const categories = game.settings.categories ?? [];

  return (
    <Box
      sx={{
        height: "calc(100vh - 120px)",
        display: "grid",
        gridTemplateAreas: '"categories" "asset" "name" "content" "choices"',
        gridTemplateRows: "100px 100px 100px 1fr 200px",
      }}
    >
      <Box
        sx={{
          gridArea: "categories",
          border: draging ? "1px dashed black" : "",
        }}>
        Category
        <Space size={2} />
        <Select value={game.pages[selectedPage].category ?? ""}>
          <MenuItem
            value=""
            onClick={() =>
              dispatch(changePage({ category: "" }))
            }
          >
            <Typography>No category</Typography>
          </MenuItem>
          {categories.map((category, index) => (
            <MenuItem
              key={`category${index + 42}`}
              value={category.name}
              onClick={() =>
                dispatch(changePage({ category: category.name }))
              }
            >
              <Typography>{category.name}</Typography>
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box
        sx={{
          gridArea: "asset",
          border: draging ? "1px dashed black" : "",
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

          const newAssets = await Array.from(e.dataTransfer.files).reduce<
            Promise<Map<string, string>>
          >(
            async (
              assetsMemoPromise: Promise<Map<string, string>>,
              fi: File,
              index: number
            ) => {
              const assetsMemo = await assetsMemoPromise;

              if (/^image/.test(fi.type)) {
                const pathName = assetPath("images", fi.name);
                zip.file(pathName, fi);

                const image = await readImage(fi);
                assetsMemo.set(fi.name, image);

                if (index === 0) {
                  dispatch(changePage({ image: fi.name }));
                }
              }

              return assetsMemo;
            },
            Promise.resolve(new Map<string, string>())
          );

          dispatch(addAssets({ assets: newAssets, type: "images" }));

          setDraging(false);
        }}
      >
        <PermMediaSharpIcon />
        <Space size={2} />
        <Select value={game.pages[selectedPage].image}>
          {Array.from(assets.images.keys()).map((image, index) => (
            <MenuItem
              key={`image${index + 42}`}
              value={image}
              onClick={() =>
                dispatch(changePage({ image }))
              }
            >
              <StyledImg src={assets.images.get(image)} alt="" />
              <Space size={2} />
              <Typography>{noExt(image)}</Typography>
            </MenuItem>
          ))}
        </Select>
        <Space size={2} />
        <Button
          disabled={!game.pages[selectedPage].image}
          variant="contained"
          onClick={() =>
            dispatch(changePage({ image: undefined }))
          }
        >
          <DeleteSharpIcon />
        </Button>
        <Space size={2} />
        <Typography>{draging ? "drag images here" : ""}</Typography>
      </Box>
      <Box
        sx={{
          height: "calc(10vh-20px)",
          paddingTop: "20px",
          gridArea: "name",
        }}
      >
        <TextField
          label="Page Title"
          variant="outlined"
          value={game.pages[selectedPage].name}
          onChange={(e) =>
            dispatch(changePage({ name: e.target.value }))
          }
        />
      </Box>
      <Box sx={{ paddingTop: "20px", gridArea: "content" }}>
        <TextField
          multiline
          fullWidth
          label="Page Content"
          variant="outlined"
          value={game.pages[selectedPage].text}
          onChange={(e) =>
            dispatch(changePage({ text: e.target.value }))
          }
          sx={{ height: "100%", width: "100%" }}
        />
        {/* <MarkdownEditor page={game.pages[selectedPage]} /> */}
      </Box>
      {/* Choice List */}
      <Box
        sx={{
          gridArea: "choices",
        }}
      >
        <Container sx={{ overflow: "auto" }}>
          <List>
            {game.pages[selectedPage].next.map((choice, index) => (
              <ListItem key={`choice-${index + 42}`}>
                <TextField
                  label="Choice Text"
                  variant="outlined"
                  value={choice.action}
                  sx={{ width: "50%" }}
                  onChange={(e) => {
                    console.log(e.target.value);
                    dispatch(changeChoice({ choice: { action: e.target.value }, position: index }));
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
                        dispatch(changeChoice({ choice: { pageId: pa.id }, position: index }))
                      }
                    >
                      {pa.name}
                    </MenuItem>
                  ))}
                </Select>
                <Space size={2} />
                <TextField
                  label="Choice Comdition"
                  variant="outlined"
                  value={choice.condition ?? ""}
                  sx={{ width: "50%" }}
                  onChange={(e) =>
                    dispatch(changeChoice({ choice: { condition: e.target.value }, position: index }))
                  }
                />
                <Space size={2} />
                <Button
                  variant="contained"
                  onClick={() =>
                    dispatch(removeChoice(index))
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
                  dispatch(addChoice())
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
