import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import BrushSharpIcon from "@mui/icons-material/BrushSharp";
import SettingsBackupRestoreSharpIcon from "@mui/icons-material/SettingsBackupRestoreSharp";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";
import ApprovalSharpIcon from "@mui/icons-material/ApprovalSharp";

import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { lens } from "lens.ts";

import ColorPicker from "./utils/ColorPicker";
import GameViewerEditor from "./GameViewerEditor";

import { State } from "../utils/state";
import { identity } from "../utils/utils";
import { Format, Page } from "../utils/initialStuff";

const pageL = lens<Page>();

const FixedTypo = styled(Typography)`
  width: 100px;
`;

export default function ViewWindow() {
  const { game, selectedPage } = useSelector<State, State>(identity);
  const dispatch = useDispatch();
  const page = game.pages[selectedPage];

  const [editing, setEditing] = useState(false);
  const [format, setFormat] = useState(page.format);
  useMemo(() => {
    setFormat(page.format);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.id]);

  const updateFormat = (newFormat: Partial<Format>) =>
    setFormat({ ...format, ...newFormat });

  return (
    <Grid container spacing={0.2} alignItems="stretch">
      <Grid item xs={editing ? 8 : 11}>
        <GameViewerEditor
          page={pageL.format.set(format)(page)}
          onClick={null}
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
                value={format.textColor ?? "black"}
                onChange={(color) => updateFormat({ textColor: color })}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Choice</FixedTypo>
              <ColorPicker
                value={format.btnColor ?? "black"}
                onChange={(color) => updateFormat({ btnColor: color })}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Page</FixedTypo>
              <ColorPicker
                value={format.page ?? "black"}
                onChange={(color) => updateFormat({ page: color })}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Background</FixedTypo>
              <ColorPicker
                value={format.background ?? "black"}
                onChange={(color) => updateFormat({ background: color })}
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
                    dispatch({
                      type: "updateFormat",
                      format,
                    })
                  }
                >
                  <SaveSharpIcon />
                </Button>
              </Tooltip>
              <Tooltip title="make global" arrow>
                <Button
                  variant="contained"
                  onClick={() =>
                    dispatch({
                      type: "updateGlobalFormat",
                      format,
                    })
                  }
                >
                  <ApprovalSharpIcon />
                </Button>
              </Tooltip>
            </Stack>
          </Box>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}
