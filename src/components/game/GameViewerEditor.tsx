import { Box } from "@mui/system";

import PermMediaSharpIcon from "@mui/icons-material/PermMediaSharp";
import { useDispatch, useSelector } from "react-redux";

import { Choice, Page } from "../../utils/initialStuff";
import {
  assetPath,
  evalCondition,
  getExtensions,
  openFiles,
  readImage,
} from "../../utils/utils";
import { useState } from "react";
import Button from "@mui/material/Button";

import EditableField from "../utils/EditableField";
import StyledButton from "./StyledButton";
import StyledImg from "./StyledImg";
import { css } from "@emotion/css";
import { addAssets, changeChoice, changePage } from "../../store/gameSlice";
import { RootState } from "../../store/store";

interface CompProp {
  page: Page;
  onClick: ((choice: Choice) => void) | null;
  state: any;
}

export default function GameViewerEditor(props: CompProp) {
  const { game, assets, zip, } = useSelector((state: RootState) => state.game);

  const { page, onClick, state } = props;

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
          dispatch(changePage({ image: fi.name }));
        }

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
          label="Choice Text"
          multiline={false}
          onChange={(e) => {
            dispatch(changeChoice({
              choice: { action: e.target.value },
              position: index,
            }));
          }}
          state={state}
        />
      </StyledButton>
    );
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
          backgroundColor: page.format.page ?? game.format.page,
          color: page.format.textColor ?? game.format.textColor,
        }}
      >
        <div
          className={css`
            text-align: center;
          `}
        >
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
                        dispatch(changePage({ image: fi.name }));
                      }
                    }

                    return assetsMemo;
                  },
                  Promise.resolve(new Map<string, string>())
                );

                dispatch(addAssets({
                  assets: newAssets,
                  type: "images",
                }));

                setDraging(false);
              }}
            >
              <Button onClick={addAsset("image")}>
                <PermMediaSharpIcon />
              </Button>
            </Box>
          )}
        </div>
        <EditableField
          content={page.text}
          label="Page Content"
          multiline={true}
          onChange={(e) => {
            dispatch(changePage({ text: e.target.value }));
          }}
          state={state}
        />
        <Box
          className="story"
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {page.next.filter(choice => {
            const condition = choice.condition;
            return condition === undefined || condition === "" || evalCondition(state.$state, condition)
          }).map(choiceButton)}
        </Box>
      </Box>
    </Box>
  );
}
