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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { useState } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { lens } from 'lens.ts';

import TabPanel from './components/TabPanel';
import TopBar from './components/TopBar';
import PageEditor from './components/PageEditor';
import ViewWindow from './components/ViewWindow';
import Space from './components/Space';

import {
  initialState,
  initialPage,
  initialChoice,
  Page,
  State,
} from '../utils/initialStuff';
import { nothing, openAZip } from '../utils/utils';
import { compile } from '../utils/format';

const Editor = () => {
  const [state, setState] = useState(initialState());
  const [selectedPage, setSelectedPage] = useState(0);
  const [pageId, setPageId] = useState(3);
  const [selectedTab, setSelectedTab] = useState(0);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [_zip, setZip] = useState(new JSZip());

  const stateL = lens<State>();
  const pageL = lens<Page>();

  const loadState = () => {
    openAZip((z: JSZip) => {
      const data = z.file('data.json');

      if (data !== null) {
        data
          .async('text')
          .then((text) => setState(JSON.parse(text)))
          .catch(nothing);
        setZip(z);
      }
    });
  };

  const saveState = () => {
    const zipLoad = new JSZip();
    zipLoad.file('data.json', JSON.stringify(state));
    zipLoad
      .generateAsync({ type: 'blob' })
      .then((blob) => saveAs(blob, 'game.zip'))
      .catch(nothing);
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
      if (selectedPage === newPages.length) {
        setSelectedPage(selectedPage - 1);
      }
      setState(stateL.pages.set(newPages)(state));
    }
  };

  const findPage = (id: number) => {
    const page = state.pages.find((p) => p.id === id);
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
      <TopBar
        load={loadState}
        save={saveState}
        compile={compileState}
        findPage={findPage}
        state={state}
      />
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
                  <Button
                    variant={page.isFirst ? 'contained' : 'outlined'}
                    disabled={page.isFirst}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFirst(index);
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
              <PageEditor
                addChoice={addChoice}
                changeTitle={changeTitle}
                changeText={changeText}
                findPage={findPage}
                selectedPage={selectedPage}
                state={state}
              />
            </TabPanel>

            {/* Game Visualisation */}
            <TabPanel value={selectedTab} index={1}>
              <ViewWindow state={state} findPage={findPage} playable={false} />
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
