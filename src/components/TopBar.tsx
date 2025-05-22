import FolderOpenSharpIcon from "@mui/icons-material/FolderOpenSharp";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import FileDownloadSharpIcon from "@mui/icons-material/FileDownloadSharp";
import PlayArrowSharpIcon from "@mui/icons-material/PlayArrowSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FeedSharpIcon from "@mui/icons-material/FeedSharp";
import AllInboxSharpIcon from '@mui/icons-material/AllInboxSharp';
// import HelpSharp from '@mui/icons-material/HelpSharp';

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/system/Box";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
// import Card from '@mui/material/Card';
// import DialogContentText from '@mui/material/DialogContentText';

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { invoke } from "@tauri-apps/api/tauri";
import { saveAs } from "file-saver";
import { Fragment } from "react";

import AssetsManager from "../pages/AssetsManager";
import GraphViewer from "./topBar/GraphViewer";

import { loadState, safeFileName } from "../utils/utils";
import { compile } from "../utils/format";
import { addAssets, loadGame, newProject } from "../store/gameSlice";
import { RootState } from "../store/store";
import { addAssetsToZip } from "../utils/assets";
import JSZip from "jszip";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const { game, assets: globalAssets } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [graph, setGraph] = useState(false);
  // const [infos, setInfos] = useState(false);

  const play = () => {
    navigate("/player/menu");
  }

  const loadAState = async () => {
    const state = await loadState();
    dispatch(loadGame({ game: state.game }));
    dispatch(addAssets({
      assets: state.images,
      type: "images",
    }));
    dispatch(addAssets({
      assets: state.musics,
      type: "musics",
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
      await invoke("save", { content: binary, fileType: "project", openModal: false });
      return;
    } catch (e) {
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, safeFileName(`${game.settings.gameTitle || "game"}.zip`));
    }

    //saveAs(blob, "game.zip");
  };

  const saveStateAs = async () => {
    const zip = new JSZip();
    addAssetsToZip(globalAssets, zip);
    zip.file("data.json", JSON.stringify(game));

    try {
      const binary = await zip.generateAsync({ type: "base64" });
      await invoke("save", { content: binary, fileType: "project", openModal: true });
    } catch (e) {
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, safeFileName(`${game.settings.gameTitle || "game"}.zip`));
    }
  };

  const compileState = () => {
    // download('game.html', format(JSON.stringify(state), false, state.settings));
    const zip = new JSZip();
    addAssetsToZip(globalAssets, zip);
    compile(game, globalAssets, zip);
  };

  return (
    <Grid container direction="column" spacing={0.2} justifyContent="center" alignItems="stretch">
      <Grid item xs={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center", backgroundColor: "primary" }}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState: any) => (
              <Fragment>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  File
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={makeNewProject}>New project</MenuItem>
                  <MenuItem onClick={() => loadAState()}>Open project</MenuItem>
                  <MenuItem onClick={saveState}>Save</MenuItem>
                  <MenuItem onClick={saveStateAs}>Save as</MenuItem>
                </Menu>
              </Fragment>
            )}
          </PopupState>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState: any) => (
              <Fragment>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  Tools
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={() => navigate("/assets")}>Assets</MenuItem>
                  <MenuItem onClick={() => setGraph(true)}>Pages graph</MenuItem>
                  <MenuItem onClick={() => navigate("/allPages")}>Proofreading</MenuItem>
                </Menu>
              </Fragment>
            )}
          </PopupState>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState: any) => (
              <Fragment>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  Game
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={
                    play}
                  >
                    Play
                  </MenuItem>
                  <MenuItem onClick={compileState}>Compile</MenuItem>
                  <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
                </Menu>
              </Fragment>
            )}
          </PopupState>
        </ButtonGroup>
      </Grid>
      <Grid item xs={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          sx={{ backgroundColor: "#1976d2", width: "100%", marginTop: "16px" }}
        >
          <Tooltip title="new project" arrow>
            <Button
              variant="contained"
              onClick={makeNewProject}
            >
              <FeedSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="save project" arrow>
            <Button
              variant="contained"
              onClick={saveState}
            >
              <SaveSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="open project" arrow>
            <Button
              variant="contained"
              onClick={() => loadAState()}
            >
              <FolderOpenSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="test game" arrow>
            <Button
              variant="contained"
              onClick={play}
            >
              <PlayArrowSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="compile game" arrow>
            <Button variant="contained" onClick={compileState}>
              <FileDownloadSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="game settings" arrow>
            <Button variant="contained" onClick={() => navigate("/settings")}>
              <SettingsSharpIcon />
            </Button>
          </Tooltip>
          <Tooltip title="game assets" arrow>
            <Button variant="contained" onClick={() => navigate("/assets")}>
              <AllInboxSharpIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Grid>
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
