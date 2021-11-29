/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/system/Box';

import FlagSharpIcon from '@mui/icons-material/FlagSharp';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp';
import CodeSharpIcon from '@mui/icons-material/CodeSharp';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';

import TabPanel from './components/TabPanel';
import TopBar from './components/TopBar';
import PageEditor from './components/PageEditor';
import ViewWindow from './components/ViewWindow';
import Space from './components/Space';

import { State } from '../utils/state';
import { identity } from '../utils/utils';

const Editor = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const { game, selectedPage } = useSelector<State, State>(identity);
  const dispatch = useDispatch();

  return (
    <Box sx={{ padding: '8px' }}>
      <TopBar />
      {/* Editor */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={3} xl={2}>
          {/* Page List */}
          <List sx={{ overflow: 'auto' }}>
            {game.pages.map((page, index) => (
              <ListItem
                onClick={() => dispatch({ type: 'setSelectedPage', index })}
                key={page.id}
                sx={{
                  bgcolor: index === selectedPage ? 'secondary.main' : '',
                  cursor: 'pointer',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'text.primary',
                  }}
                >
                  <Button
                    variant={page.isFirst ? 'contained' : 'outlined'}
                    disabled={page.isFirst}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({
                        type: 'setFirst',
                        index,
                      });
                    }}
                  >
                    <FlagSharpIcon
                      sx={{
                        color: page.isFirst ? 'yellow' : 'black',
                      }}
                    />
                  </Button>
                  <Space size={2} />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color: index === selectedPage ? 'white' : '',
                  }}
                  primary={page.name}
                />
                <Button
                  variant="contained"
                  disabled={game.pages.length === 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({
                      type: 'removePage',
                      index,
                    });
                  }}
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
          <Box>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={selectedTab}
                onChange={(_e, value: number) => setSelectedTab(value)}
                aria-label="basic tabs example"
              >
                <Tab icon={<EditSharpIcon />} />
                <Tab icon={<PlayArrowSharpIcon />} />
                <Tab icon={<CodeSharpIcon />} />
              </Tabs>
            </Box>

            {/* Game Edition */}
            <TabPanel value={selectedTab} index={0}>
              <PageEditor />
            </TabPanel>

            {/* Game Visualisation */}
            <TabPanel value={selectedTab} index={1}>
              <ViewWindow />
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
              Item Three
            </TabPanel>
          </Box>
          {/* <Divider textAlign="left">Page Data</Divider> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Editor} />
      </Switch>
    </Router>
  );
}
