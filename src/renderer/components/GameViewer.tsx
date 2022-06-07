import { Box } from '@mui/system';
// import { Button } from '@mui/material';

import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import { Choice, Page } from '../../utils/initialStuff';
import { identity, safeMarkdown } from '../../utils/utils';
import { State } from '../../utils/state';

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
  const { game, assets } = useSelector<State, State>(identity);

  const { page, onClick } = props;

  const choiceButton = (choice: Choice, index: number) => {
    return (
      <StyledButton
        type="button"
        key={`poll_${index + 42}`}
        onClick={() => onClick && onClick(choice)}
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
        padding: '10%',
        minHeight: '50vh',
        backgroundColor: page.format.background ?? game.format.background,
        overflowX: 'auto',
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
        <div className="story-image">
          <StyledImg src={assets.images.get(page.image)} alt="" />
          {/*
          page.image !== '' ? (
            <img src={assets.images.get(page.image)} alt="" />
          ) : (
            <Button variant="outlined">hello</Button>
          )
          */}
        </div>
        <p
          className="story-text"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: safeMarkdown(page.text),
          }}
        />
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
