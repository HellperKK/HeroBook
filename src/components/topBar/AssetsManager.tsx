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

import { State } from "../../utils/state";
import {
  identity,
  openFiles,
  readImage,
  noExt,
  assetPath,
  getExtensions,
} from "../../utils/utils";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { addAssets, removeAsset } from "../../store/gameSlice";
import { RootState } from "../../store/store";

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
  const { zip, assets } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const [selectedAsset, setSelectedAsset] = useState(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [draging, setDraging] = useState(false);

  const { images } = assets;

  const addAsset = (assetType: string) => async () => {
    const files = await openFiles(getExtensions(assetType), true);
    // const newAssets = new Map<string, string>();

    const arrFiles = Array.from(files);

    const newAssets = await arrFiles.reduce<Promise<Map<string, string>>>(
      async (assetsMemoPromise: Promise<Map<string, string>>, fi: File) => {
        const assetsMemo = await assetsMemoPromise;
        const pathName = assetPath(assetType, fi.name);
        zip.file(pathName, fi);

        const image = await readImage(fi);
        assetsMemo.set(fi.name, image);
        return assetsMemo;
      },
      Promise.resolve(new Map<string, string>())
    );

    dispatch(addAssets({
      assets: newAssets,
      type: "images",
    }));
  };

  const removeAssets = (assetType: string, assetName: string) => () => {
    const pathName = assetPath(assetType, assetName);
    zip.remove(pathName);

    if (assets.images.size === 1 || assets.images.size === selectedAsset + 1) {
      setSelectedAsset(assets.images.size - 2);
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
            {Array.from(images.entries()).map((pair, index) => (
              <ImageListItem
                key={index}
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
                  src={pair[1]}
                  alt={pair[0]}
                  loading="lazy"
                  onClick={() => setSelectedImageIndex(index)}
                />
                <Button
                  onClick={removeAssets("images", pair[0])}
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
