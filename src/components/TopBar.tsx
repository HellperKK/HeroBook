import FolderOpenSharpIcon from "@mui/icons-material/FolderOpenSharp";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import PermMediaSharpIcon from "@mui/icons-material/PermMediaSharp";
import FileDownloadSharpIcon from "@mui/icons-material/FileDownloadSharp";
import PlayArrowSharpIcon from "@mui/icons-material/PlayArrowSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FeedSharpIcon from "@mui/icons-material/FeedSharp";
// import HelpSharp from '@mui/icons-material/HelpSharp';

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/system/Box";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
// import Card from '@mui/material/Card';
// import DialogContentText from '@mui/material/DialogContentText';

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { invoke } from "@tauri-apps/api/tauri";
import { saveAs } from "file-saver";

import GameWindow from "./game/GameWindow";
import AssetsManager from "./topBar/AssetsManager";
import GraphViewer from "./topBar/GraphViewer";
import SettingsWindow from "./topBar/SettingsWindow";

import { loadState, safeFileName, safeInvokeSave } from "../utils/utils";
import { compile } from "../utils/format";
import { addAssets, loadGame, newProject, resetGameState } from "../store/gameSlice";
import { RootState } from "../store/store";
import { addAssetsToZip } from "../utils/assets";
import JSZip from "jszip";

export default function TopBar() {
  const { game, assets: globalAssets } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const [settings, setSettings] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [assets, setAssets] = useState(false);
  const [graph, setGraph] = useState(false);
  // const [infos, setInfos] = useState(false);

  const loadAState = async () => {
    const state = await loadState();
    dispatch(loadGame({ game: state.game }));
    dispatch(addAssets({
      assets: state.assets,
      type: "images",
    }));
  };

  const makeNewProject = async () => {
    try {
      const res = await invoke("new", {});
    } catch (error) { }
    dispatch(newProject());
  };

  const saveState = async () => {
    const zip = new JSZip();
    addAssetsToZip(globalAssets, zip);
    zip.file("data.json", JSON.stringify(game));

    try {
      const binary = await zip.generateAsync({ type: "base64" });
      await invoke("save", { content: binary, fileType: "project" });
      return;
    } catch (e) {
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, safeFileName(`${game.settings.gameTitle || "game"}.zip`));
    }

    //saveAs(blob, "game.zip");
  };

  const compileState = () => {
    // download('game.html', format(JSON.stringify(state), false, state.settings));
    const zip = new JSZip();
    addAssetsToZip(globalAssets, zip);
    compile(game, zip);
  };

  return (
    <Grid container spacing={0.2} justifyContent="center" alignItems="stretch">
      <Grid item xs={1}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Tooltip title="new game" arrow>
            <Button variant="contained" onClick={makeNewProject}>
              <FeedSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="load a game" arrow>
            <Button variant="contained" onClick={loadAState}>
              <FolderOpenSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="save a game" arrow>
            <Button variant="contained" onClick={saveState}>
              <SaveSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="game settings" arrow>
            <Button variant="contained" onClick={() => setSettings(true)}>
              <SettingsSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="test game" arrow>
            <Button
              variant="contained"
              onClick={() => {
                setPlaying(true);
              }}
            >
              <PlayArrowSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="compile game" arrow>
            <Button variant="contained" onClick={compileState}>
              <FileDownloadSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="manage assets" arrow>
            <Button variant="contained" onClick={() => setAssets(true)}>
              <PermMediaSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="visualize graph" arrow>
            <Button variant="contained" onClick={() => setGraph(true)}>
              <AccountTreeIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Grid>
      <SettingsWindow open={settings} close={() => setSettings(false)} />
      <Modal open={playing}>
        <Box
          sx={{ height: "100vh", backgroundColor: "white", overflowX: "auto" }}
        >
          <GameWindow start={game.pages[0].id} />

          <Container>
            <Button
              variant="contained"
              onClick={() => {
                setPlaying(false);
                // dispatch(resetGameState());
              }}
              sx={{ width: "100%" }}
            >
              <CloseSharpIcon />
            </Button>
          </Container>
        </Box>
      </Modal>
      <Modal open={graph}>
        <Box
          sx={{ height: "100vh", backgroundColor: "white", overflowX: "auto" }}
        >
          <GraphViewer />

          <Container>
            <Button
              variant="contained"
              onClick={() => setGraph(false)}
              sx={{ width: "100%" }}
            >
              <CloseSharpIcon />
            </Button>
          </Container>
        </Box>
      </Modal>
      <AssetsManager open={assets} close={() => setAssets(false)} />
      {/* <Modal open={infos}>
        <Card>
          hi
          <Button variant="contained" onClick={() => setInfos(false)}>
            <CloseSharpIcon />
          </Button>
        </Card>
      </Modal> */}
    </Grid>
  );
}
