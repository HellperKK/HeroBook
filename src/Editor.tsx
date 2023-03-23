import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/system/Box";
import Tooltip from "@mui/material/Tooltip";

import FlagSharpIcon from "@mui/icons-material/FlagSharp";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import PlayArrowSharpIcon from "@mui/icons-material/PlayArrowSharp";
// import PriorityHighSharpIcon from '@mui/icons-material/PriorityHighSharp';

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TabPanel from "./components/utils/TabPanel";
import TopBar from "./components/TopBar";
import PageEditor from "./components/PageEditor";
import ViewWindow from "./components/ViewWindow";
import Space from "./components/utils/Space";
import PageTitleEdition from "./components/PageTitleEdition";

import { State } from "./utils/state";
import { identity } from "./utils/utils";

export default function Editor() {
  const [selectedTab, setSelectedTab] = useState(0);

  const { game, selectedPage } = useSelector<State, State>(identity);
  const dispatch = useDispatch();

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
            {game.pages.map((page, index) => (
              <ListItem
                onClick={() => {
                  dispatch({ type: "setSelectedPage", index });
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
                        dispatch({
                          type: "setFirst",
                          index,
                        });
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
                      dispatch({
                        type: "removePage",
                        index,
                      });
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
                    dispatch({
                      type: "addPage",
                    })
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
    </Box>
  );
}
