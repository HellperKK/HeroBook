import { useState } from 'react';
import styled from '@emotion/styled';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import BrushSharpIcon from '@mui/icons-material/BrushSharp';
import Box from '@mui/system/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import GameWindow from './GameWindow';
import ColorPicker from './ColorPicker';

import { State, Page } from '../../utils/initialStuff';

interface CompProp {
  state: State;
  findPage: (pageId: number) => Page;
  playable: boolean;
}

const FixedTypo = styled(Typography)`
  width: 100px;
`;

export default function ViewWindow(props: CompProp) {
  const { state, findPage, playable } = props;

  const [editing, setEditing] = useState(false);

  return (
    <Grid container spacing={0.2} alignItems="stretch">
      <Grid item xs={editing ? 8 : 11}>
        <GameWindow state={state} findPage={findPage} playable={playable} />
      </Grid>
      <Grid item xs={editing ? 4 : 1}>
        <Button variant="contained" onClick={() => setEditing(!editing)}>
          <BrushSharpIcon />
        </Button>
        {editing ? (
          <Box>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Text</FixedTypo>
              <ColorPicker />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Choice</FixedTypo>
              <ColorPicker />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Page</FixedTypo>
              <ColorPicker />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Background</FixedTypo>
              <ColorPicker />
            </Stack>
          </Box>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}
