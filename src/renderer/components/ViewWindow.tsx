import { useState } from 'react';
import styled from '@emotion/styled';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import BrushSharpIcon from '@mui/icons-material/BrushSharp';
import Box from '@mui/system/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useSelector, useDispatch } from 'react-redux';

import { State } from '../../utils/state';
import { identity, nothing } from '../../utils/utils';

import GameViewer from './GameViewer';
import ColorPicker from './ColorPicker';

const FixedTypo = styled(Typography)`
  width: 100px;
`;

export default function ViewWindow() {
  const { game, selectedPage } = useSelector<State, State>(identity);
  const dispatch = useDispatch();
  const page = game.pages[selectedPage];

  const [editing, setEditing] = useState(false);

  return (
    <Grid container spacing={0.2} alignItems="stretch">
      <Grid item xs={editing ? 8 : 11}>
        <GameViewer page={page} onClick={nothing} />
      </Grid>
      <Grid item xs={editing ? 4 : 1}>
        <Button variant="contained" onClick={() => setEditing(!editing)}>
          <BrushSharpIcon />
        </Button>
        {editing ? (
          <Box>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Text</FixedTypo>
              <ColorPicker
                value={page.format.textColor ?? 'black'}
                onChange={(color) =>
                  dispatch({
                    type: 'updateFormat',
                    format: { textColor: color },
                  })
                }
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Choice</FixedTypo>
              <ColorPicker
                value={page.format.btnColor ?? 'black'}
                onChange={(color) =>
                  dispatch({
                    type: 'updateFormat',
                    format: { btnColor: color },
                  })
                }
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Page</FixedTypo>
              <ColorPicker
                value={page.format.page ?? 'black'}
                onChange={(color) =>
                  dispatch({
                    type: 'updateFormat',
                    format: { page: color },
                  })
                }
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <FixedTypo>Background</FixedTypo>
              <ColorPicker
                value={page.format.background ?? 'black'}
                onChange={(color) =>
                  dispatch({
                    type: 'updateFormat',
                    format: { background: color },
                  })
                }
              />
            </Stack>
          </Box>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}
