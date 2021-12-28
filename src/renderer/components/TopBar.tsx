/* eslint-disable promise/no-nesting */
import FolderOpenSharpIcon from '@mui/icons-material/FolderOpenSharp';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import PermMediaSharpIcon from '@mui/icons-material/PermMediaSharp';
import FileDownloadSharpIcon from '@mui/icons-material/FileDownloadSharp';
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';

import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useSelector, useDispatch } from 'react-redux';

import GameWindow from './GameWindow';
import AssetsManager from './AssetsManager';

import { State } from '../../utils/state';
import { nothing, openAZip, identity, readImage } from '../../utils/utils';
import { compile } from '../../utils/format';

export default function TopBar() {
  const { game, zip } = useSelector<State, State>(identity);
  const dispatch = useDispatch();

  const [settings, setSettings] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [assets, setAssets] = useState(false);

  const loadState = () => {
    openAZip((z: JSZip) => {
      const data = z.file('data.json');

      if (data !== null) {
        data
          .async('text')
          .then((text) => {
            dispatch({ type: 'loadGame', game: JSON.parse(text), zip: z });
            const images = z.folder('assets/images');

            if (images !== null) {
              Object.entries(images.files).forEach((pair) => {
                const matches = pair[0].match(/assets\/images\/(.*)/);
                if (!matches || !matches[1]) return;

                pair[1]
                  .async('blob')
                  .then((blob) =>
                    readImage(blob, (url) =>
                      dispatch({
                        type: 'addAssets',
                        files: new Map([[matches[1], url]]),
                        fileType: 'images',
                      })
                    )
                  )
                  .catch(nothing);
              });
            }

            return text;
          })
          .catch(nothing);
      }
    });
  };

  const saveState = () => {
    zip.file('data.json', JSON.stringify(game));
    zip
      .generateAsync({ type: 'blob' })
      .then((blob) => saveAs(blob, 'game.zip'))
      .catch(nothing);
  };

  const compileState = () => {
    // download('game.html', format(JSON.stringify(state), false, state.settings));
    compile(game, zip);
  };

  return (
    <Grid container spacing={0.2} justifyContent="center" alignItems="stretch">
      <Grid item xs={1}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button variant="contained" onClick={loadState}>
            <FolderOpenSharpIcon />
          </Button>
          <Button variant="contained" onClick={saveState}>
            <SaveSharpIcon />
          </Button>
          <Button variant="contained" onClick={() => setSettings(true)}>
            <SettingsSharpIcon />
          </Button>
          <Button variant="contained" onClick={() => setPlaying(true)}>
            <PlayArrowSharpIcon />
          </Button>
          <Button variant="contained" onClick={() => setAssets(true)}>
            <PermMediaSharpIcon />
          </Button>
          <Button variant="contained" onClick={compileState}>
            <FileDownloadSharpIcon />
          </Button>
        </ButtonGroup>
      </Grid>
      <Modal open={settings}>
        <Box
          sx={{ height: '100vh', backgroundColor: 'white', overflowX: 'auto' }}
        >
          <Container>
            <Box sx={{ height: '60px', paddingTop: '20px' }}>
              <TextField
                label="Author"
                variant="outlined"
                value={game.settings.author}
                onChange={(e) =>
                  dispatch({
                    type: 'updateSettings',
                    settings: { author: e.target.value },
                  })
                }
              />
            </Box>
            <Box sx={{ height: '60px', paddingTop: '20px' }}>
              <TextField
                label="Title"
                variant="outlined"
                value={game.settings.gameTitle}
                onChange={(e) =>
                  dispatch({
                    type: 'updateSettings',
                    settings: { gameTitle: e.target.value },
                  })
                }
              />
            </Box>
          </Container>
          <Container>
            <Button
              variant="contained"
              onClick={() => setSettings(false)}
              sx={{ width: '100%' }}
            >
              <CloseSharpIcon />
            </Button>
          </Container>
        </Box>
      </Modal>
      <Modal open={playing}>
        <Box
          sx={{ height: '100vh', backgroundColor: 'white', overflowX: 'auto' }}
        >
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
      <AssetsManager open={assets} close={() => setAssets(false)} />
    </Grid>
  );
}
