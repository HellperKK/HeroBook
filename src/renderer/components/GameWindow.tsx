import { useState } from 'react';
import { Box } from '@mui/system';
import styled from '@emotion/styled';

import { State, Page, Choice } from '../../utils/initialStuff';

const StyledButton = styled.button`
  color: ${(props) => props.color};
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

interface CompProp {
  state: State;
  findPage: (pageId: number) => Page;
  playable: boolean;
}

export default function GameWindow(props: CompProp) {
  const { state, findPage, playable } = props;
  const [currentPage, setCurrentPage] = useState(state.pages[0].id);

  const choiceButton = (choice: Choice, index: number) => {
    const play = () => setCurrentPage(choice.pageId);
    const noPlay = () => {};
    return (
      <StyledButton
        type="button"
        key={`poll_${index + 42}`}
        onClick={playable ? play : noPlay}
        color={findPage(currentPage).format.btnColor ?? state.format.btnColor}
      >
        {'>'} {choice.action}
      </StyledButton>
    );
  };

  return (
    <Box
      sx={{
        padding: '10%',
        height: '50vh',
        backgroundColor:
          findPage(currentPage).format.background ?? state.format.background,
      }}
    >
      <Box
        className="story"
        sx={{
          height: '100%',
          padding: '8px',
          textAlign: 'center',
          backgroundColor:
            findPage(currentPage).format.page ?? state.format.page,
          color:
            findPage(currentPage).format.textColor ?? state.format.textColor,
        }}
      >
        <div className="story-image" />
        <p className="story-text">{findPage(currentPage).text}</p>
        <Box className="story-choices">
          {findPage(currentPage).next.map(choiceButton)}
        </Box>
      </Box>
    </Box>
  );
}
