import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem/ListItem';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import AddSharpIcon from '@mui/icons-material/AddSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import PermMediaSharpIcon from '@mui/icons-material/PermMediaSharp';

import { useSelector, useDispatch } from 'react-redux';

import { State } from '../../utils/state';
import { findPage, identity } from '../../utils/utils';

import Space from './Space';

export default function PageEditor() {
  const { game, selectedPage, assets } = useSelector<State, State>(identity);
  const dispatch = useDispatch();

  return (
    <Box>
      <PermMediaSharpIcon />
      <Space size={2} />
      <Select value={game.pages[selectedPage].image}>
        {Array.from(assets.images.keys()).map((image, index) => (
          <MenuItem key={`image${index + 42}`} value={image}>
            {image}
          </MenuItem>
        ))}
      </Select>
      <Box sx={{ height: 'calc(10vh-20px)', paddingTop: '20px' }}>
        <TextField
          label="Page Title"
          variant="outlined"
          value={game.pages[selectedPage].name}
          onChange={(e) =>
            dispatch({
              type: 'changeTitle',
              title: e.target.value,
            })
          }
        />
      </Box>
      <Box sx={{ height: '55vh', paddingTop: '20px' }}>
        <TextField
          multiline
          fullWidth
          label="Page Content"
          variant="outlined"
          value={game.pages[selectedPage].text}
          onChange={(e) =>
            dispatch({
              type: 'changeText',
              text: e.target.value,
            })
          }
          sx={{ height: '100%', width: '100%' }}
        />
      </Box>
      {/* Choice List */}
      <Box sx={{ height: '30vh' }}>
        <Container>
          <List sx={{ overflow: 'auto' }}>
            {game.pages[selectedPage].next.map((choice, index) => (
              <ListItem key={`choice-${index + 42}`}>
                <TextField
                  label="Choice Text"
                  variant="outlined"
                  value={choice.action}
                  sx={{ width: '50%' }}
                  onChange={(e) =>
                    dispatch({
                      type: 'changeAction',
                      text: e.target.value,
                      index,
                    })
                  }
                />
                <Select
                  value={findPage(game.pages, choice.pageId).id}
                  sx={{ width: '30%' }}
                >
                  {game.pages.map((page) => (
                    <MenuItem
                      key={page.id}
                      value={page.id}
                      onClick={() =>
                        dispatch({
                          type: 'changeChoice',
                          id: page.id,
                          index,
                        })
                      }
                    >
                      {page.name}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  variant="contained"
                  onClick={() =>
                    dispatch({
                      type: 'removeChoice',
                      index,
                    })
                  }
                >
                  <DeleteSharpIcon />
                </Button>
              </ListItem>
            ))}
            <ListItem>
              <Button
                variant="contained"
                onClick={() =>
                  dispatch({
                    type: 'addChoice',
                  })
                }
                sx={{ width: '85%' }}
              >
                <AddSharpIcon />
              </Button>
            </ListItem>
          </List>
        </Container>
      </Box>
    </Box>
  );
}
