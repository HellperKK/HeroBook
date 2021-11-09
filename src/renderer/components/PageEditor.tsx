import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem/ListItem';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import FlagSharpIcon from '@mui/icons-material/FlagSharp';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

import { State, Page } from '../../utils/initialStuff';

interface CompProp {
  selectedPage: number;
  state: State;
  changeTitle: (pageIndex: number, title: string) => void;
  setFirst: (pageIndex: number) => void;
  changeText: (pageIndex: number, title: string) => void;
  findPage: (pageId: number) => Page;
  addChoice: (pageIndex: number) => void;
}

export default function PageEditor(props: CompProp) {
  const {
    changeTitle,
    setFirst,
    changeText,
    findPage,
    addChoice,
    selectedPage,
    state,
  } = props;
  return (
    <Box>
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
                  value={findPage(choice.pageId).id}
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
    </Box>
  );
}
