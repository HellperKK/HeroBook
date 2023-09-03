import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/system/Box";
import Container from "@mui/material/Container";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { useState } from "react";

import {
  openFiles,
  readImage,
  noExt,
  assetPath,
  getExtensions,
} from "../../utils/utils";
import { Asset, addAssets, changePage, removeAsset } from "../../store/gameSlice";
import { RootState } from "../../store/store";
import { addFilesToZip, loadAssets } from "../../utils/assets";

const StyledImage = styled.img`
  max-width: 85vw;
  max-height: 80vh;
`;
const StyledMiniature = styled.img`
  max-width: 80px;
  max-height: 40px;
`;

interface CompProps {
  open: boolean;
  close: () => void;
}

export default function AssetsManager(props: CompProps) {
  const { open, close } = props;
  const { game, zip, assets } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const [selectedAsset, setSelectedAsset] = useState(-1);
  const [draging, setDraging] = useState(false);
  const { images } = assets;

  const addAsset = (assetType: string) => async () => {
    const files = await openFiles(getExtensions(assetType), true);
    // const newAssets = new Map<string, string>();

    const arrFiles = Array.from(files);
    addFilesToZip(arrFiles, zip);
    const newAssets = await loadAssets(arrFiles);

    dispatch(addAssets({
      assets: newAssets,
      type: "images",
    }));
  };

  const removeAssets = (assetType: string, assetName: string) => () => {
    const pathName = assetPath(assetType, assetName);
    zip.remove(pathName);

    if (assets.images.length === 1 || assets.images.length === selectedAsset + 1) {
      setSelectedAsset(assets.images.length - 2);
    }

    dispatch(removeAsset({
      name: assetName,
      type: assetType,
    }));
  };

  return (
    <Modal open={open}>
      <Box sx={{ height: "100vh", backgroundColor: "white" }}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={3} xl={2}>
            {/* Image List */}
            <List sx={{ overflow: "auto" }}>
              {images.map(({ name: fileName, content }, index) => (
                <ListItem
                  onClick={() => setSelectedAsset(index)}
                  key={fileName}
                  sx={{
                    bgcolor: index === selectedAsset ? "secondary.main" : "",
                    cursor: "pointer",
                  }}
                >
                  <StyledMiniature src={content} alt="" />
                  <ListItemText
                    primary={noExt(fileName)}
                    sx={{
                      color: index === selectedAsset ? "white" : "",
                    }}
                  />
                  <Button
                    variant="contained"
                    disabled={game.pages.length === 1}
                    onClick={removeAssets("images", fileName)}
                  >
                    <DeleteSharpIcon />
                  </Button>
                </ListItem>
              ))}
              <ListItem>
                <Button
                  variant="contained"
                  sx={{ width: "100%" }}
                  onClick={addAsset("images")}
                >
                  <AddSharpIcon />
                </Button>
              </ListItem>
            </List>
          </Grid>

          {/* Image Display */}
          <Grid item xs={9} xl={10}>
            <Box
              sx={{
                height: "90vh",
                padding: "12px",
              }}
            >
              <Box
                sx={{
                  height: "100px",
                  backgroundColor: "lightgray",
                  textAlign: "center",
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

                  const arrFiles = Array.from(e.dataTransfer.files);
                  addFilesToZip(arrFiles, zip);
                  const newAssets = await loadAssets(arrFiles);

                  dispatch(addAssets({
                    assets: newAssets,
                    type: "images",
                  }));

                  setDraging(false);
                }}
              >
                <Typography>drag images here</Typography>
              </Box>
              <StyledImage
                src={assets.images[selectedAsset].content}
              />
            </Box>
          </Grid>
        </Grid>
        <Container>
          <Button variant="contained" onClick={close} sx={{ width: "100%" }}>
            <CloseSharpIcon />
          </Button>
        </Container>
      </Box>
    </Modal>
  );
}
