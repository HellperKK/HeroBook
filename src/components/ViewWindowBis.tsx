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

import ColorPicker from "./utils/ColorPicker";
import GameViewerEditor from "./game/GameViewerEditor";

import { Format, Page } from "../utils/initialStuff";
import { changeVisualState, updateFormat, updateGlobalFormat } from "../store/gameSlice";
import { RootState } from "../store/store";
import { useParams } from "react-router-dom";

import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";

const FixedTypo = styled(Typography)`
  width: 100px;
`;

export default function ViewWindowBis() {
  const { game, visualizingStates } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const { id } = useParams();
  const selectedPageIndex = game.pages.findIndex(page => page.id === parseInt(id!, 10));
  const selectedPage = game.pages[selectedPageIndex];

  const state: string = visualizingStates[selectedPageIndex] ?? "{}";

  const trueState = { $state: {} };
  try {
    trueState.$state = JSON.parse(state);
  } catch (error) {}

  const updateNewFormat = (newFormat: Partial<Format>) => {
    dispatch(updateFormat({ format: newFormat, pageId: selectedPage.id }));
  }

  return (
    <Grid container spacing={0.2} alignItems="stretch">
      <Grid item xs={12}>
        <GameViewerEditor
          page={selectedPage}
          onClick={null}
          state={trueState}
        />
      </Grid>
    </Grid>
  );
}
