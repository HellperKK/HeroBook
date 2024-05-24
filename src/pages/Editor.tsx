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

import AddSharpIcon from "@mui/icons-material/AddSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import AllInboxSharpIcon from '@mui/icons-material/AllInboxSharp';
// import PriorityHighSharpIcon from '@mui/icons-material/PriorityHighSharp';

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TabPanel from "../components/utils/TabPanel";
import TopBar from "../components/TopBar";
import PageEditor from "../components/PageEditor";
import ViewWindow from "../components/ViewWindow";
import Space from "../components/utils/Space";
import PageTitleEdition from "../components/PageTitleEdition";

import { addCategory, addPage, changeCategory, removeCategory, removePage, setFirst } from "../store/gameSlice";
import { RootState } from "../store/store";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "../utils/initialStuff";
import ScriptEditor from "../components/ScriptEditor";
import PageList from "../components/PageList";
import PageFolder from "../components/PageFolder";

export default function Editor() {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(0);

  const { game } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const categories = game.settings.categories ?? [];
  const visibleCategories = categories.filter(category => category.visible);

  const { id } = useParams();
  const selectedPage = game.pages.find(page => page.id === parseInt(id!, 10));

  if (!selectedPage) {
    navigate(`/editor/${game.pages[0].id}`)
    return <></>
  }

  const defineColor = (page: Page) => {
    if (page.id === selectedPage.id) return "secondary.light";

    return "";
  };

  return (
    <Box sx={{ padding: "8px", backgroundColor: "white", overflowY: "scroll" }}>
      <TopBar />
      {/* Editor */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={3} xl={2} sx={
          {
            overflowY: "scroll",
            height: "90vh",
            marginTop: "20px",
            backgroundColor: "#ccc"
          }
        }>
          {/* Page List */}
          {/*<PageList />*/}
          <PageFolder />
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
                  <Tab icon={"Edit"} />
                </Tooltip>
                <Tooltip title="content visualization" arrow>
                  <Tab icon={"Visualize"} />
                </Tooltip>
                {game.settings.expert && <Tooltip title="content edition" arrow>
                  <Tab icon={"Script"} />
                </Tooltip>}
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
              <ScriptEditor />
            </TabPanel>
          </Box>
          {/* <Divider textAlign="left">Page Data</Divider> */}
        </Grid>
      </Grid>
    </Box >
  );
}
