import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp';
import StopSharpIcon from '@mui/icons-material/StopSharp';

import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/system/Box";
import Container from "@mui/material/Container";

import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { useRef, useState } from "react";

import {
  openFiles,
  assetPath,
  getExtensions,
} from "../utils/utils";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { addAssets, removeAsset } from "../store/gameSlice";
import { RootState } from "../store/store";
import { addFilesToZip, loadAssets } from "../utils/assets";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Tabs } from "@mui/material";
import TabPanel from "../components/utils/TabPanel";

const StyledImage = styled.img`
  max-width: 85vw;
  max-height: 80vh;
`;
const StyledMiniature = styled.img`
  max-width: 80px;
  max-height: 40px;
`;

export default function AssetsManager() {
  const { assets, game } = useSelector((state: RootState) => state.game);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const [musicIndex, setMusicIndex] = useState(-1);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const [selectedAsset, setSelectedAsset] = useState(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { images, musics } = assets;

  const addAsset = (assetType: string) => async () => {
    const files = await openFiles(getExtensions(assetType), true);
    // const newAssets = new Map<string, string>();

    const arrFiles = Array.from(files);
    const newAssets = await loadAssets(arrFiles);

    dispatch(addAssets({
      assets: newAssets,
      type: assetType,
    }));
  };

  const removeAssets = (assetType: string, assetName: string) => () => {
    const pathName = assetPath(assetType, assetName);

    if (assets.images.length === 1 || assets.images.length === selectedAsset + 1) {
      setSelectedAsset(assets.images.length - 2);
    }

    dispatch(removeAsset({
      name: assetName,
      type: assetType,
    }));
  };

  return (
    <Box sx={{ height: "100vh", backgroundColor: "white" }}>
      <Link to={`/editor/${game.pages[0].id}`}>Back to editor</Link>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={(_e, newValue) => setSelectedTab(newValue)}>
          <Tab label="Images" />
          <Tab label="Musics" />
          <Tab label="Sounds" />
        </Tabs>
      </Box>
      {/* images pannel*/}
      <TabPanel value={selectedTab} index={0}>
        <Container>
          <ImageList cols={4} rowHeight={300}>
            <ImageListItem sx={{ height: 450 }}>
              <Button
                variant="contained"
                sx={{ width: "100%", height: "100%" }}
                onClick={addAsset("images")}
              >
                <AddSharpIcon />
              </Button>
            </ImageListItem>
            {images.map(({ name, content }, index) => (
              <ImageListItem
                key={name}
                sx={{
                  border:
                    selectedImageIndex == index ? "solid 3px blue" : "none",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <img
                  className={css`
                    max-height: 265px;
                  `}
                  src={content}
                  alt={name}
                  loading="lazy"
                  onClick={() => setSelectedImageIndex(index)}
                />
                <Button
                  onClick={removeAssets("images", name)}
                  variant="contained"
                >
                  <DeleteSharpIcon />
                </Button>
              </ImageListItem>
            ))}
          </ImageList>
        </Container>
      </TabPanel>
      {/* musics pannel*/}
      <TabPanel value={selectedTab} index={1}>
        <Container>
          <ImageList cols={4} rowHeight={300}>
            <ImageListItem sx={{ height: 450 }}>
              <Button
                variant="contained"
                sx={{ width: "100%", height: "100%" }}
                onClick={addAsset("musics")}
              >
                <AddSharpIcon />
              </Button>
            </ImageListItem>
            {musics.map(({ name, content }, index) => (
              <ImageListItem
                key={name}
                sx={{
                  border:
                    selectedImageIndex == index ? "solid 3px blue" : "none",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <span>{name}</span>
                {index !== musicIndex && <Button
                  onClick={() => {
                    if (audio !== null) {
                      audio.pause()
                    }
                    const newAudio = new Audio(content);
                    newAudio.onended = () => {
                      setAudio(null);
                      setMusicIndex(-1);
                    }
                    newAudio.play();
                    setAudio(newAudio);
                    setMusicIndex(index);
                  }}
                  variant="contained"
                >
                  <PlayArrowSharpIcon />
                </Button>}
                {index === musicIndex && <Button
                  onClick={() => {
                    if (audio !== null) {
                      audio.pause()
                    }
                    setAudio(null);
                    setMusicIndex(-1);
                  }}
                  variant="contained"
                >
                  <StopSharpIcon />
                </Button>}
                <Button
                  onClick={() => {
                    if (audio !== null) {
                      audio.pause()
                      setAudio(null);
                    }
                    removeAssets("musics", name)()
                  }}
                  variant="contained"
                >
                  <DeleteSharpIcon />
                </Button>
              </ImageListItem>
            ))}
          </ImageList>
        </Container>
      </TabPanel>
    </Box>
  );
}
