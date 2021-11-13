import { useState } from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import GameWindow from './GameWindow';

import { State, Page } from '../../utils/initialStuff';

interface CompProp {
  state: State;
  findPage: (pageId: number) => Page;
  playable: boolean;
}

export default function ViewWindow(props: CompProp) {
  const { state, findPage, playable } = props;

  const [editing, setEditing] = useState(false);

  return (
    <Grid container spacing={0.2} alignItems="stretch">
      <Grid item xs={editing ? 8 : 11}>
        <GameWindow state={state} findPage={findPage} playable={playable} />
      </Grid>
      <Grid item xs={editing ? 4 : 1}>
        <Button
          variant="contained"
          onClick={() => setEditing(!editing)}
          sx={{ width: '100%' }}
        >
          hi
        </Button>
      </Grid>
    </Grid>
  );
}
