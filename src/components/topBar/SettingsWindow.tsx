import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import SettingsBackupRestoreSharpIcon from "@mui/icons-material/SettingsBackupRestoreSharp";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";

import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Tooltip from "@mui/material/Tooltip";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import { updateSettings } from "../../store/gameSlice";
import { RootState } from "../../store/store";

interface CompProps {
  open: boolean;
  close: () => void;
}

export default function SettingsWindow(props: CompProps) {
  const { open, close } = props;

  const { game } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const [settings, setSettings] = useState(game.settings);

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle id="alert-dialog-title">Settings</DialogTitle>
      <DialogContent>
        <Container>
          <Box sx={{ height: "60px", paddingTop: "20px" }}>
            <TextField
              label="Author"
              variant="outlined"
              value={settings.author}
              onChange={(e) =>
                setSettings({ ...settings, author: e.target.value })
              }
            />
          </Box>
          <Box sx={{ height: "60px", paddingTop: "20px" }}>
            <TextField
              label="Title"
              variant="outlined"
              value={settings.gameTitle}
              onChange={(e) =>
                setSettings({ ...settings, gameTitle: e.target.value })
              }
            />
          </Box>
        </Container>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tooltip title="revert changes" arrow>
          <Button
            variant="contained"
            onClick={() => setSettings(game.settings)}
          >
            <SettingsBackupRestoreSharpIcon />
          </Button>
        </Tooltip>
        <Tooltip title="save" arrow>
          <Button
            variant="contained"
            onClick={() =>
              dispatch(updateSettings(settings))
            }
          >
            <SaveSharpIcon />
          </Button>
        </Tooltip>
        <Button variant="contained" onClick={close}>
          <CloseSharpIcon />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
