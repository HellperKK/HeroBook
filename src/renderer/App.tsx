/* eslint-disable no-console */
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import FlagSharpIcon from '@mui/icons-material/FlagSharp';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp';
import CodeSharpIcon from '@mui/icons-material/CodeSharp';

import { useState, ReactNode } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { lens } from 'lens.ts';
import {
  initialState,
  initialPage,
  initialChoice,
  Page,
  State,
} from '../utils/initialStuff';
import { openAFile, download } from '../utils/utils';
import { compile } from '../utils/format';

import TopBar from './components/topBar';

interface TabPanelProps {
  // eslint-disable-next-line react/require-default-props
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Editor = () => {
  const [state, setState] = useState(initialState());
  const [selectedPage, setSelectedPage] = useState(0);
  const [pageId, setPageId] = useState(3);
  const [selectedTab, setSelectedTab] = useState(0);

  const stateL = lens<State>();
  const pageL = lens<Page>();

  const loadState = () => {
    console.log('test');
    openAFile((file: File) => {
      file
        .text()
        .then((content) => setState(JSON.parse(content)))
        .catch(() => {});
    });
  };

  const saveState = () => {
    download('gameData.json', JSON.stringify(state));
  };

  const compileState = () => {
    // download('game.html', format(JSON.stringify(state), false, state.settings));
    compile(state, false);
  };

  const addPage = () => {
    const newPage = pageL.id.set(pageId)(initialPage());
    setState(stateL.pages.set(state.pages.concat([newPage]))(state));
    setPageId(pageId + 1);
  };

  const addChoice = (index: number) => {
    const newChoices = initialChoice();
    setState(
      stateL.pages[index].next.set(
        state.pages[index].next.concat([newChoices])
      )(state)
    );
    setPageId(pageId + 1);
  };

  const removePage = (index: number) => {
    if (state.pages.length > 1) {
      const newPages = state.pages.slice();
      newPages.splice(index, 1);
      if (selectedPage === index) {
        setSelectedPage(selectedPage === 0 ? 0 : selectedPage - 1);
      }
      setState(stateL.pages.set(newPages)(state));
    }
  };

  const findPage = (pages: Array<Page>, id: number) => {
    const page = pages.find((p) => p.id === id);
    if (page !== undefined) {
      return page;
    }

    return initialPage();
  };

  const changeTitle = (index: number, title: string) => {
    setState(stateL.pages[index].name.set(title)(state));
  };

  const changeText = (index: number, text: string) => {
    setState(stateL.pages[index].text.set(text)(state));
  };

  const setFirst = (index: number) => {
    const firstPageIndex = state.pages.findIndex((page) => page.isFirst);
    if (firstPageIndex !== -1) {
      setState(stateL.pages[firstPageIndex].isFirst.set(false)(state));
    }
    setState((currentState) =>
      stateL.pages[index].isFirst.set(true)(currentState)
    );
  };

  return (
    <Box sx={{ padding: '8px' }}>
      <TopBar load={loadState} save={saveState} compile={compileState} />
      {/* Editor */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={3} xl={2}>
          {/* Page List */}
          <List sx={{ overflow: 'auto' }}>
            {state.pages.map((page, index) => (
              <ListItem
                onClick={() => setSelectedPage(index)}
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
                  {page.isFirst ? (
                    <FlagSharpIcon
                      sx={{
                        color: index === selectedPage ? 'white' : '',
                      }}
                    />
                  ) : (
                    <div />
                  )}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color: index === selectedPage ? 'white' : '',
                  }}
                  primary={page.name}
                />
                <Button
                  variant="contained"
                  disabled={state.pages.length === 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    removePage(index);
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
                onClick={addPage}
              >
                <AddSharpIcon />
              </Button>
            </ListItem>
          </List>
        </Grid>
        {/* Page Data */}
        <Grid item xs={9} xl={10}>
          <Box sx={{ width: '100%' }}>
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
            <TabPanel value={selectedTab} index={0}>
              <Box sx={{ height: 'calc(10vh-20px)', paddingTop: '20px' }}>
                <TextField
                  label="Page Title"
                  variant="outlined"
                  value={state.pages[selectedPage].name}
                  onChange={(e) => changeTitle(selectedPage, e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={() => setFirst(selectedPage)}
                  disabled={state.pages[selectedPage].isFirst}
                >
                  <FlagSharpIcon />
                </Button>
              </Box>
              <Box sx={{ height: '55vh', paddingTop: '20px' }}>
                <TextField
                  multiline
                  fullWidth
                  label="Page Content"
                  variant="outlined"
                  value={state.pages[selectedPage].text}
                  onChange={(e) => changeText(selectedPage, e.target.value)}
                  sx={{ height: '100%', width: '100%' }}
                />
              </Box>
              {/* Choice List */}
              <Box sx={{ height: '30vh' }}>
                <Container>
                  <List sx={{ overflow: 'auto' }}>
                    {state.pages[selectedPage].next.map((choice, index) => (
                      <ListItem key={`choice-${index + 42}`}>
                        <TextField
                          label="Choice Text"
                          variant="outlined"
                          value={choice.action}
                          sx={{ width: '50%' }}
                        />
                        <Select
                          value={findPage(state.pages, choice.pageId).id}
                          sx={{ width: '30%' }}
                        >
                          {state.pages.map((page) => (
                            <MenuItem key={page.id} value={page.id}>
                              {page.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <Button variant="contained" onClick={() => {}}>
                          <DeleteSharpIcon />
                        </Button>
                      </ListItem>
                    ))}
                    <ListItem>
                      <Button
                        variant="contained"
                        onClick={() => addChoice(selectedPage)}
                        sx={{ width: '85%' }}
                      >
                        <AddSharpIcon />
                      </Button>
                    </ListItem>
                  </List>
                </Container>
              </Box>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              Item Two
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
