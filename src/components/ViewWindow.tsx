import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";

import BrushSharpIcon from "@mui/icons-material/BrushSharp";
import SettingsBackupRestoreSharpIcon from "@mui/icons-material/SettingsBackupRestoreSharp";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";
import ApprovalSharpIcon from "@mui/icons-material/ApprovalSharp";

import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { lens } from "lens.ts";

import ColorPicker from "./utils/ColorPicker";
import GameViewerEditor from "./game/GameViewerEditor";

import { Format, Page } from "../utils/initialStuff";
import { changeVisualState, updateFormat, updateGlobalFormat } from "../store/gameSlice";
import { RootState } from "../store/store";

const pageL = lens<Page>();

const FixedTypo = styled(Typography)`
  width: 100px;
`;

export default function ViewWindow() {
  const { game, selectedPage, visulaizingStates } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const page = game.pages[selectedPage];
  const state: string = visulaizingStates[selectedPage] ?? "{}";

  const trueState = { $state: {} };
  try {
    trueState.$state = JSON.parse(state);
  } catch (error) {

  }

  const [editing, setEditing] = useState(false);
  const [format, setFormat] = useState(page.format);
  useMemo(() => {
    setFormat(page.format);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.id]);

  const updateNewFormat = (newFormat: Partial<Format>) =>
    setFormat({ ...format, ...newFormat });

  return (
    <Grid container spacing={0.2} alignItems="stretch">
      <Grid item xs={editing ? 8 : 11}>
        <GameViewerEditor
          page={pageL.format.set(format)(page)}
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
                value={format.textColor ?? game.format.textColor}
                onChange={(color) => updateNewFormat({ textColor: color })}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Choice</FixedTypo>
              <ColorPicker
                value={format.btnColor ?? game.format.btnColor}
                onChange={(color) => updateNewFormat({ btnColor: color })}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Page</FixedTypo>
              <ColorPicker
                value={format.page ?? game.format.page}
                onChange={(color) => updateNewFormat({ page: color })}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Background</FixedTypo>
              <ColorPicker
                value={format.background ?? game.format.background}
                onChange={(color) => updateNewFormat({ background: color })}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Tooltip title="revert changes" arrow>
                <Button
                  variant="contained"
                  onClick={() => setFormat(page.format)}
                >
                  <SettingsBackupRestoreSharpIcon />
                </Button>
              </Tooltip>
              <Tooltip title="save" arrow>
                <Button
                  variant="contained"
                  onClick={() =>
                    dispatch(updateFormat(format))
                  }
                >
                  <SaveSharpIcon />
                </Button>
              </Tooltip>
              <Tooltip title="make global" arrow>
                <Button
                  variant="contained"
                  onClick={() =>
                    (dispatch(updateGlobalFormat(format)))
                  }
                >
                  <ApprovalSharpIcon />
                </Button>
              </Tooltip>
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                multiline
                fullWidth
                label="Page state"
                variant="outlined"
                value={state}
                onChange={(e) => dispatch(changeVisualState({ id: selectedPage, content: e.target.value }))}
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
