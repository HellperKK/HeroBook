import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";

import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/system/Box";
import Container from "@mui/material/Container";

import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { useState } from "react";

import {
  openFiles,
  readImage,
  assetPath,
  getExtensions,
} from "../../utils/utils";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { addAssets, removeAsset } from "../../store/gameSlice";
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
  const { assets } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const [selectedAsset, setSelectedAsset] = useState(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [draging, setDraging] = useState(false);

  const { images } = assets;

  const addAsset = (assetType: string) => async () => {
    const files = await openFiles(getExtensions(assetType), true);
    // const newAssets = new Map<string, string>();

    const arrFiles = Array.from(files);
    const newAssets = await loadAssets(arrFiles);

    dispatch(addAssets({
      assets: newAssets,
      type: "images",
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
    <Modal open={open}>
      <Box sx={{ height: "100vh", backgroundColor: "white" }}>
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
        <Container>
          <Button variant="contained" onClick={close} sx={{ width: "100%" }}>
            <CloseSharpIcon />
          </Button>
        </Container>
      </Box>
    </Modal>
  );
}
