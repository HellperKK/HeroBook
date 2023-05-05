/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/system";
// import { Button } from '@mui/material';

import { useDispatch, useSelector } from "react-redux";
import ejs from "ejs";

import { Choice, Page } from "../../utils/initialStuff";
import { identity, safeMarkdown } from "../../utils/utils";
import { State } from "../../utils/state";

import StyledButton from "./StyledButton";
import StyledImg from "./StyledImg";

interface CompProp {
  page: Page;
  onClick: ((choice: Choice) => void) | null;
}

export default function GameViewer(props: CompProp) {
  const { game, assets, gameState } = useSelector<State, State>(identity);

  const { page, onClick } = props;

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
        dangerouslySetInnerHTML={{
          __html: safeMarkdown(` > ${choice.action}`),
        }}
      />
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
        <div className="story-image">
          <StyledImg src={assets.images.get(page.image)} alt="" />
        </div>
        <p
          className="story-text"
          dangerouslySetInnerHTML={{
            __html: safeMarkdown(ejs.render(page.text, gameState)),
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
