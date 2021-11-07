import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import FolderOpenSharpIcon from '@mui/icons-material/FolderOpenSharp';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import PermMediaSharpIcon from '@mui/icons-material/PermMediaSharp';
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp';
import FileDownloadSharpIcon from '@mui/icons-material/FileDownloadSharp';
import FlagSharpIcon from '@mui/icons-material/FlagSharp';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddSharpIcon from '@mui/icons-material/AddSharp';
// import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import { ThemeProvider } from '@mui/private-theming';

import { useState } from 'react';
import './App.global.css';
import { lens } from 'lens.ts';
import createTheme from '@mui/material/styles/createTheme';
import { orange } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
// import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import {
  initialState,
  initialPage,
  initialChoice,
  Page,
  State,
} from '../utils/initialStuff';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const Editor = () => {
  const [state, setState] = useState(initialState());
  const [selectedPage, setSelectedPage] = useState(0);
  const [pageId, setPageId] = useState(3);

  const stateL = lens<State>();
  const pageL = lens<Page>();

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
      const newPages = state.pages.slice();
      newPages[firstPageIndex] = pageL.isFirst.set(false)(
        state.pages[firstPageIndex]
      );
      newPages[index] = pageL.isFirst.set(true)(state.pages[index]);
      setState(stateL.pages.set(newPages)(state));
    }
  };

  return (
    <Box sx={{ padding: '8px' }}>
      {/* Menu Bar */}
      <Grid
        container
        spacing={0.2}
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item xs={1}>
          <Button variant="contained">
            <FolderOpenSharpIcon />
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained">
            <SaveSharpIcon />
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained">
            <SettingsSharpIcon />
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained">
            <PermMediaSharpIcon />
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained">
            <PlayArrowSharpIcon />
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained">
            <FileDownloadSharpIcon />
          </Button>
        </Grid>
      </Grid>
      {/* Editor */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={3} xl={2}>
          {/* Page List */}
          <List sx={{ overflow: 'auto' }}>
            {state.pages.map((page, index) => (
              <ListItem
                onClick={() => setSelectedPage(index)}
                key={page.id}
                sx={{ bgcolor: index === selectedPage ? 'secondary.main' : '' }}
              >
                <ListItemIcon
                  sx={{
                    color: 'text.primary',
                  }}
                >
                  {page.isFirst ? <FlagSharpIcon /> : <div />}
                </ListItemIcon>
                <ListItemText primary={page.name} />
                <Button variant="contained" onClick={() => removePage(index)}>
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
          {/* <Divider textAlign="left">Page Data</Divider> */}
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
              sx={{ height: '100%' }}
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
              sx={{ height: '100%' }}
            />
          </Box>
          {/* Choice List */}
          <Box sx={{ height: '30vh' }}>
            <List sx={{ overflow: 'auto' }}>
              {state.pages[selectedPage].next.map((choice, index) => (
                <ListItem key={`choice-${index + 42}`}>
                  <TextField
                    label="Choice Text"
                    variant="outlined"
                    value={choice.action}
                  />
                  <Select value={findPage(state.pages, choice.pageId).id}>
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
                >
                  <AddSharpIcon />
                </Button>
              </ListItem>
            </List>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const theme = createTheme({
  status: {
    danger: orange[500],
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" component={Editor} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
