/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/system";

import PermMediaSharpIcon from "@mui/icons-material/PermMediaSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import ColorLensSharpIcon from "@mui/icons-material/ColorLensSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
// import { Button } from '@mui/material';

import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";

import { Choice, Page } from "../utils/initialStuff";
import { identity, openFiles, readImage, safeMarkdown } from "../utils/utils";
import { State } from "../utils/state";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import EditableField from "./utils/EditableField";
// import * as ejs from "../utils/ejs";

const assetPath = (assetType: string, assetName: string) =>
  `assets/${assetType}/${assetName}`;

const StyledButton = styled.button`
  color: ${(props) => props.color};
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const StyledImg = styled.img`
  max-width: 80%;
`;

interface CompProp {
  page: Page;
  onClick: ((choice: Choice) => void) | null;
}

const getExtensions = (assetType: string) => {
  switch (assetType) {
    case "image":
      return [
        "image/jpeg",
        "image/gif",
        "image/bmp",
        "image/png",
        "image/webp",
      ];
    default:
      return [];
  }
};

export default function GameViewerEditor(props: CompProp) {
  const { game, assets, gameState, zip, selectedPage } = useSelector<
    State,
    State
  >(identity);

  const { page, onClick } = props;

  const [draging, setDraging] = useState(false);

  const dispatch = useDispatch();

  const addAsset = (assetType: string) => async () => {
    const files = await openFiles(getExtensions(assetType), true);
    // const newAssets = new Map<string, string>();

    const arrFiles = Array.from(files);

    const newAssets = await arrFiles.reduce<Promise<Map<string, string>>>(
      async (
        assetsMemoPromise: Promise<Map<string, string>>,
        fi: File,
        index: number
      ) => {
        const assetsMemo = await assetsMemoPromise;
        const pathName = assetPath(assetType, fi.name);
        zip.file(pathName, fi);

        if (index === 0 && /^image/.test(fi.type)) {
          dispatch({
            type: "changePage",
            page: { image: fi.name },
          });
        }

        const image = await readImage(fi);
        assetsMemo.set(fi.name, image);
        return assetsMemo;
      },
      Promise.resolve(new Map<string, string>())
    );

    dispatch({
      type: "addAssets",
      files: newAssets,
      fileType: "images",
    });
  };

  const choiceButton = (choice: Choice, index: number) => {
    return (
      <StyledButton
        type="button"
        key={`poll_${index + 42}`}
        onClick={() => {
          if (onClick !== null) {
            onClick(choice);
          }
        }}
        color={page.format.btnColor ?? game.format.btnColor}
      >
        <EditableField
          content={`${choice.action}`}
          pagePosition={selectedPage}
          label="Choice Text"
          multiline={false}
          onChange={(e) => {
            dispatch({
              type: "changeChoice",
              choice: { action: e.target.value },
              index,
            });
          }}
        />
      </StyledButton>
    );
  };

  const defs: any = {
    $state: gameState,
  };

  return (
    <Box
      sx={{
        padding: "10%",
        minHeight: "50vh",
        backgroundColor: page.format.background ?? game.format.background,
        overflowX: "auto",
      }}
    >
      <Box
        className="story"
        sx={{
          height: "100%",
          padding: "8px",
          textAlign: "center",
          backgroundColor: page.format.page ?? game.format.page,
          color: page.format.textColor ?? game.format.textColor,
        }}
      >
        <div className="story-image">
          {assets.images.get(page.image) !== undefined ? (
            <div>
              <StyledImg src={assets.images.get(page.image)} alt="" />
            </div>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                border: draging ? "1px dashed black" : "",
                color: "gray",
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

                const newAssets = await Array.from(e.dataTransfer.files).reduce<
                  Promise<Map<string, string>>
                >(
                  async (
                    assetsMemoPromise: Promise<Map<string, string>>,
                    fi: File,
                    index: number
                  ) => {
                    const assetsMemo = await assetsMemoPromise;

                    if (/^image/.test(fi.type)) {
                      const pathName = assetPath("images", fi.name);
                      zip.file(pathName, fi);

                      const image = await readImage(fi);
                      assetsMemo.set(fi.name, image);

                      if (index === 0) {
                        dispatch({
                          type: "changePage",
                          page: { image: fi.name },
                        });
                      }
                    }

                    return assetsMemo;
                  },
                  Promise.resolve(new Map<string, string>())
                );

                dispatch({
                  type: "addAssets",
                  files: newAssets,
                  fileType: "images",
                });

                setDraging(false);
              }}
            >
              <Button onClick={addAsset("image")}>
                <PermMediaSharpIcon />
              </Button>
            </Box>
          )}
          {/*
          page.image !== '' ? (
            <img src={assets.images.get(page.image)} alt="" />
          ) : (
            <Button variant="outlined">hello</Button>
          )
          */}
        </div>
        <EditableField
          content={page.text}
          pagePosition={selectedPage}
          label="Page Content"
          multiline={true}
          onChange={(e) => {
            dispatch({
              type: "changePage",
              page: { text: e.target.value },
            });
          }}
        />
        <Box
          className="story"
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {page.next.map(choiceButton)}
        </Box>
      </Box>
    </Box>
  );
}
