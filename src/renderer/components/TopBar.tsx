import FolderOpenSharpIcon from '@mui/icons-material/FolderOpenSharp';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import PermMediaSharpIcon from '@mui/icons-material/PermMediaSharp';
import FileDownloadSharpIcon from '@mui/icons-material/FileDownloadSharp';
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';

import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useSelector, useDispatch } from 'react-redux';

import GameWindow from './GameWindow';
import { State } from '../../utils/state';
import { nothing, openAZip, identity } from '../../utils/utils';
import { compile } from '../../utils/format';

export default function TopBar() {
  const { game } = useSelector<State, State>(identity);
  const dispatch = useDispatch();

  const [playing, setPlaying] = useState(false);
  const [assets, setAssets] = useState(false);

  const loadState = () => {
    openAZip((z: JSZip) => {
      const data = z.file('data.json');

      if (data !== null) {
        data
          .async('text')
          .then((text) =>
            dispatch({ type: 'loadGame', game: JSON.parse(text), zip: z })
          )
          .catch(nothing);
      }
    });
  };

  const saveState = () => {
    const zipLoad = new JSZip();
    zipLoad.file('data.json', JSON.stringify(game));
    zipLoad
      .generateAsync({ type: 'blob' })
      .then((blob) => saveAs(blob, 'game.zip'))
      .catch(nothing);
  };

  const compileState = () => {
    // download('game.html', format(JSON.stringify(state), false, state.settings));
    compile(game, false);
  };

  return (
    <Grid container spacing={0.2} justifyContent="center" alignItems="stretch">
      <Grid item xs={1}>
        <Button variant="contained" onClick={loadState}>
          <FolderOpenSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" onClick={saveState}>
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
        <Button variant="contained" onClick={() => setAssets(true)}>
          <PermMediaSharpIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" onClick={compileState}>
          <FileDownloadSharpIcon />
        </Button>
      </Grid>
      <Modal open={playing}>
        <Box sx={{ height: '100vh', backgroundColor: 'white' }}>
          <GameWindow start={game.pages[0].id} />

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
      <Modal open={assets}>
        <Box sx={{ height: '100vh', backgroundColor: 'white' }}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={3} xl={2}>
              {/* Page List */}
              <List sx={{ overflow: 'auto' }}>
                {game.assets.images.map((image, index) => (
                  <ListItem onClick={nothing} key={`item${index + 42}`}>
                    <ListItemText primary={image} />
                    <Button
                      variant="contained"
                      disabled={game.pages.length === 1}
                      onClick={nothing}
                    >
                      <DeleteSharpIcon />
                    </Button>
                  </ListItem>
                ))}
                <ListItem>
                  <Button
                    variant="contained"
                    sx={{ width: '100%' }}
                    onClick={() =>
                      dispatch({
                        type: 'addPage',
                      })
                    }
                  >
                    <AddSharpIcon />
                  </Button>
                </ListItem>
              </List>
            </Grid>

            {/* Page Data */}
            <Grid item xs={9} xl={10}>
              <Box>hello</Box>
            </Grid>
          </Grid>
          <Container>
            <Button
              variant="contained"
              onClick={() => setAssets(false)}
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
