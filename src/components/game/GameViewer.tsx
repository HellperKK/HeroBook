/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/system";
// import { Button } from '@mui/material';

import { useSelector } from "react-redux";
import ejs from "ejs";

import { Choice, Page } from "../../utils/initialStuff";
import { evalCondition, identity, safeMarkdown } from "../../utils/utils";

import StyledButton from "./StyledButton";
import StyledImg from "./StyledImg";
import { css } from "@emotion/css";
import { RootState } from "../../store/store";
import { useEffect, useMemo } from "react";
import { Jinter } from "jintr";

interface CompProp {
  page: Page;
  onClick: ((choice: Choice) => void) | null;
}

export default function GameViewer(props: CompProp) {
  const { game, assets, /*gameState,*/ } = useSelector((state: RootState) => state.game);

  const { page, onClick } = props;

  const gameState = useMemo(() => ({ $state: {} }), []);
  const jinter = new Jinter(page.script ?? "")
  jinter.scope.set("$state", gameState.$state);
  jinter.interpret();

  const choiceButton = (choice: Choice, index: number) => {
    return (
      <StyledButton
        type="button"
        key={`poll_${index + 42}`}
        onClick={() => {
          console.log("clicked")
          console.log(gameState)
          if (onClick !== null) {
            onClick(choice);
          }
        }}
        color={page.format.btnColor ?? game.format.btnColor}
        dangerouslySetInnerHTML={{
          __html: safeMarkdown(` > ${choice.action}`),
        }}
      />
    );
  };

  let body = safeMarkdown(page.text);
  const image = assets.images.find(image => image.name === page.image)

  try {
    body = safeMarkdown(ejs.render(page.text, gameState));
  } catch (error) { }

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
          <StyledImg src={image?.content} alt="" />
        </div>
        <p
          className="story-text"
          dangerouslySetInnerHTML={{
            __html: safeMarkdown(body),
            // __html: safeMarkdown(ejs.render(page.text, { $state: {} })),
          }}
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
            return condition === undefined || condition === "" || evalCondition(gameState.$state, condition)
          }).map(choiceButton)}
        </Box>
      </Box>
    </Box>
  );
}
