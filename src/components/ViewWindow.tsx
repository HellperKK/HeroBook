import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";

import BrushSharpIcon from "@mui/icons-material/BrushSharp";

import { useState } from "react";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { lens } from "lens.ts";

import ColorPicker from "./utils/ColorPicker";
import GameViewerEditor from "./game/GameViewerEditor";

import { Format, Page } from "../utils/initialStuff";
import { changeVisualState, updateFormat, updateGlobalFormat } from "../store/gameSlice";
import { RootState } from "../store/store";
import { useParams } from "react-router-dom";

const pageL = lens<Page>();

const FixedTypo = styled(Typography)`
  width: 100px;
`;

export default function ViewWindow() {
  const { game, visualizingStates } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const { id } = useParams();
  const selectedPageIndex = game.pages.findIndex(page => page.id === parseInt(id!, 10));
  const selectedPage = game.pages[selectedPageIndex];

  const state: string = visualizingStates[selectedPageIndex] ?? "{}";

  const trueState = { $state: {} };
  try {
    trueState.$state = JSON.parse(state);
  } catch (error) {

  }

  const [editing, setEditing] = useState(false);

  const updateNewFormat = (newFormat: Partial<Format>) => {
    dispatch(updateFormat({ format: newFormat, pageId: selectedPage.id }));
  }

  return (
    <Grid container spacing={0.2} alignItems="stretch">
      <Grid item xs={editing ? 8 : 11}>
        <GameViewerEditor
          page={selectedPage}
          onClick={null}
          state={trueState}
        />
      </Grid>
      <Grid item xs={editing ? 4 : 1}>
        <Tooltip title="edit colors" arrow>
          <Button variant="contained" onClick={() => setEditing(!editing)}>
            <BrushSharpIcon />
          </Button>
        </Tooltip>
        {editing ? (
          <Box>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Text</FixedTypo>
              <ColorPicker
                value={selectedPage.format.textColor ?? game.format.textColor}
                onChange={(color) => dispatch(updateFormat({ format: { textColor: color }, pageId: selectedPage.id }))}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Choice</FixedTypo>
              <ColorPicker
                value={selectedPage.format.btnColor ?? game.format.btnColor}
                onChange={(color) => updateNewFormat({ btnColor: color })}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Page</FixedTypo>
              <ColorPicker
                value={selectedPage.format.page ?? game.format.page}
                onChange={(color) => updateNewFormat({ page: color })}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Background</FixedTypo>
              <ColorPicker
                value={selectedPage.format.background ?? game.format.background}
                onChange={(color) => updateNewFormat({ background: color })}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                multiline
                fullWidth
                label="Page state"
                variant="outlined"
                value={state}
                onChange={(e) => dispatch(changeVisualState({ id: selectedPageIndex, content: e.target.value }))}
                sx={{ marginTop: "20px" }}
              />
            </Stack>
          </Box>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}
