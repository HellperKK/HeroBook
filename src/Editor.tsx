import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/system/Box";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';

import FlagSharpIcon from "@mui/icons-material/FlagSharp";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import PlayArrowSharpIcon from "@mui/icons-material/PlayArrowSharp";
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
// import PriorityHighSharpIcon from '@mui/icons-material/PriorityHighSharp';

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TabPanel from "./components/utils/TabPanel";
import TopBar from "./components/TopBar";
import PageEditor from "./components/PageEditor";
import ViewWindow from "./components/ViewWindow";
import Space from "./components/utils/Space";
import PageTitleEdition from "./components/PageTitleEdition";

import { addCategory, addPage, changeCategory, removeCategory, removePage, setFirst, setSelectedPage } from "./store/gameSlice";
import { RootState } from "./store/store";

export default function Editor() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [editCategories, setEditCategories] = useState(false);

  const { game, selectedPage } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const categories = game.settings.categories ?? [];
  const visibleCategories = categories.filter(category => category.visible);

  const defineColor = (index: number) => {
    if (index === selectedPage) return "secondary.light";

    return "";
  };

  return (
    <Box sx={{ padding: "8px", backgroundColor: "white" }}>
      <TopBar />
      {/* Editor */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={3} xl={2}>
          {/* Page List */}
          <List sx={{ overflow: "auto" }}>
            <ListItem>
              <Tooltip title="page filters" arrow>
                <Button
                  variant="contained"
                  sx={{ width: "100%" }}
                  onClick={() =>
                    setEditCategories(true)
                  }
                >
                  <SettingsSharpIcon />
                </Button>
              </Tooltip>
            </ListItem>
            {game.pages
              .filter(page => page.category === undefined ||
                page.category === "" ||
                visibleCategories.some(category => category.name === page.category)
              ).map((page, index) => (
                <ListItem
                  onClick={() => {
                    dispatch(setSelectedPage(index));
                  }}
                  key={page.id}
                  sx={{
                    bgcolor: defineColor(index),
                    cursor: "pointer",
                  }}
                >
                  {/* !pageIsLinked(game.pages, page) ? (
                  <Tooltip title="no link to this page" arrow>
                    <ListItemIcon
                      sx={{
                        color: index === selectedPage ? 'yellow' : 'black',
                      }}
                    >
                      <PriorityHighSharpIcon />
                    </ListItemIcon>
                  </Tooltip>
                    ) : null */}
                  <ListItemIcon
                    sx={{
                      color: "text.primary",
                    }}
                  >
                    <Tooltip title="set this page to start the game on" arrow>
                      <Button
                        variant={page.isFirst ? "contained" : "outlined"}
                        disabled={page.isFirst}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setFirst(index));
                        }}
                      >
                        <FlagSharpIcon
                          sx={{
                            color: page.isFirst ? "yellow" : "black",
                          }}
                        />
                      </Button>
                    </Tooltip>
                  </ListItemIcon>
                  <Space size={2} />
                  <PageTitleEdition pagePosition={index} pageTitle={page.name} />
                  <Space size={2} />
                  <Tooltip title="delete page" arrow>
                    <Button
                      variant="contained"
                      disabled={game.pages.length === 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removePage(index));
                      }}
                    >
                      <DeleteSharpIcon />
                    </Button>
                  </Tooltip>
                </ListItem>
              ))}
            <ListItem>
              <Tooltip title="add a page" arrow>
                <Button
                  variant="contained"
                  sx={{ width: "100%" }}
                  onClick={() =>
                    dispatch(addPage())
                  }
                >
                  <AddSharpIcon />
                </Button>
              </Tooltip>
            </ListItem>
          </List>
        </Grid>

        {/* Page Data */}
        <Grid item xs={9} xl={10}>
          <Box>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={selectedTab}
                onChange={(_e, value: number) => setSelectedTab(value)}
                aria-label="basic tabs example"
              >
                <Tooltip title="content edition" arrow>
                  <Tab icon={<EditSharpIcon />} />
                </Tooltip>
                <Tooltip title="content visualization" arrow>
                  <Tab icon={<PlayArrowSharpIcon />} />
                </Tooltip>
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

            {/* <TabPanel value={selectedTab} index={2}>
              <CodeEditor />
                </TabPanel> */}
          </Box>
          {/* <Divider textAlign="left">Page Data</Divider> */}
        </Grid>
      </Grid>
      <Modal
        open={editCategories}
        onClose={() => setEditCategories(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{ width: "50vw", margin: "auto", backgroundColor: "white", overflowX: "auto" }}
        >
          <List sx={{ overflow: "auto" }}>

            {categories.map((category, index) =>
              <ListItem
                key={`category${index + 42}`}>
                <TextField
                  label="Category name"
                  variant="outlined"
                  value={category.name}
                  onChange={(e) =>
                    dispatch(changeCategory({ category: { name: e.target.value }, position: index }))
                  }
                />
                <Tooltip title="change category visibility" arrow>
                  <Button
                    variant="contained"
                    onClick={() =>
                      dispatch(changeCategory({ category: { visible: !category.visible }, position: index }))
                    }
                  >
                    {category.visible ? <VisibilitySharpIcon /> : <VisibilityOffSharpIcon />}
                  </Button>
                </Tooltip>
                <Tooltip title="remove category" arrow>
                  <Button
                    variant="contained"
                    onClick={() =>
                      dispatch(removeCategory(index))
                    }
                  >
                    <DeleteSharpIcon />
                  </Button>
                </Tooltip>
              </ListItem>)}
            <ListItem>
              <Button
                variant="contained"
                onClick={() =>
                  dispatch(addCategory())
                }
              >
                <AddSharpIcon />
              </Button>
            </ListItem>
          </List>
          <Button
            variant="contained"
            onClick={() => setEditCategories(false)}
            sx={{ width: "100%" }}
          >
            <CloseSharpIcon />
          </Button>
        </Box>
      </Modal >
    </Box >
  );
}
