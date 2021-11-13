import FolderOpenSharpIcon from '@mui/icons-material/FolderOpenSharp';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import PermMediaSharpIcon from '@mui/icons-material/PermMediaSharp';
import FileDownloadSharpIcon from '@mui/icons-material/FileDownloadSharp';
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';

import { useState } from 'react';

import { Page, State } from '../../utils/initialStuff';
import GameWindow from './GameWindow';

interface CompProp {
  state: State;
  load: () => void;
  save: () => void;
  compile: () => void;
  findPage: (pageId: number) => Page;
}

export default function TopBar(props: CompProp) {
  const { load, save, compile, findPage, state } = props;

  const [playing, setPlaying] = useState(false);

  return (
    <Grid container spacing={0.2} justifyContent="center" alignItems="stretch">
      <Grid item xs={1}>
        <Button variant="contained" onClick={load}>
          <FolderOpenSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" onClick={save}>
          <SaveSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained">
          <SettingsSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" onClick={() => setPlaying(true)}>
          <PlayArrowSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained">
          <PermMediaSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" onClick={compile}>
          <FileDownloadSharpIcon />
        </Button>
      </Grid>
      <Modal open={playing}>
        <Box sx={{ height: '100vh', backgroundColor: 'white' }}>
          <GameWindow playable findPage={findPage} state={state} />

          <Container>
            <Button
              variant="contained"
              onClick={() => setPlaying(false)}
              sx={{ width: '100%' }}
            >
              <CloseSharpIcon />
            </Button>
          </Container>
        </Box>
      </Modal>
    </Grid>
  );
}
