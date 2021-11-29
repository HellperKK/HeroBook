import { Box } from '@mui/system';

import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import { Choice, Page } from '../../utils/initialStuff';
import { identity } from '../../utils/utils';
import { State } from '../../utils/state';

const StyledButton = styled.button`
  color: ${(props) => props.color};
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

interface CompProp {
  page: Page;
  onClick: (choice: Choice) => void;
}

export default function GameViewer(props: CompProp) {
  const { game } = useSelector<State, State>(identity);

  const { page, onClick } = props;

  const choiceButton = (choice: Choice, index: number) => {
    return (
      <StyledButton
        type="button"
        key={`poll_${index + 42}`}
        onClick={() => onClick(choice)}
        color={page.format.btnColor ?? game.format.btnColor}
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
        backgroundColor: page.format.background ?? game.format.background,
      }}
    >
      <Box
        className="story"
        sx={{
          height: '100%',
          padding: '8px',
          textAlign: 'center',
          backgroundColor: page.format.page ?? game.format.page,
          color: page.format.textColor ?? game.format.textColor,
        }}
      >
        <div className="story-image" />
        <p className="story-text">{page.text}</p>
        <Box
          className="story"
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {page.next.map(choiceButton)}
        </Box>
      </Box>
    </Box>
  );
}
