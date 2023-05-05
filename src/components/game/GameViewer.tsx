/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/system";
// import { Button } from '@mui/material';

import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import ejs from "ejs";

import { Choice, Page } from "../../utils/initialStuff";
import { identity, safeMarkdown } from "../../utils/utils";
import { State } from "../../utils/state";
// import * as ejs from "../utils/ejs";

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

export default function GameViewer(props: CompProp) {
  const { game, assets, gameState } = useSelector<State, State>(identity);

  const { page, onClick } = props;

  const dispatch = useDispatch();

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
          <StyledImg src={assets.images.get(page.image)} alt="" />
        </div>
        <p
          className="story-text"
          // eslint-disable-next-line react/no-danger
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
