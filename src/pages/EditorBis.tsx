import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../store/store";
import { Page } from "../utils/initialStuff";
import { Box, Button, Divider, Drawer, IconButton, Paper, styled, Tab, Tabs, TextField, Tooltip } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TopBar from "../components/TopBar";
import { css } from "@emotion/css";
import TabPanel from "../components/utils/TabPanel";
import PageEditor from "../components/PageEditor";
import ViewWindow from "../components/ViewWindow";
import ScriptEditor from "../components/ScriptEditor";
import ViewWindowBis from "../components/ViewWindowBis";
import PageFolder from "../components/PageFolder";

const drawerWidth = "300px";
const drawerMiniWidth = "100px";

export default function EditorBis() {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(0);
  const [drawerLeftOpen, setDrawerLeftOpen] = useState(true);
  const [drawerRightOpen, setDrawerRightOpen] = useState(true);

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

  return <>
    <TopBar />
    <div
      className={css`
        display: grid;
        grid-template-areas: "left editor right";
        grid-template-columns: ${drawerLeftOpen ? drawerWidth : drawerMiniWidth} 1fr ${drawerRightOpen ? drawerWidth : drawerMiniWidth};
        grid-template rows: 1fr;
        height: 100%;
      `}
    >
      <div
        className={css`
          grid-area left;
          height: 100%;
          border-right: 1px solid black;
      `}
      >
        <Button variant="contained" onClick={() => setDrawerLeftOpen(isOpen => !isOpen)}>
          Pages
        </Button>
        {drawerLeftOpen && <PageFolder />}
      </div>
      <div
        className={css`
          grid-area editor;
      `}
      >
        <ViewWindowBis />
      </div>
      <div
        className={css`
          grid-area right;
          border-left: 1px solid black;
      `}
      >
        <Button variant="contained" onClick={() => setDrawerRightOpen(isOpen => !isOpen)}>
          Settings
        </Button>
        {drawerRightOpen && <>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={0}
              onChange={(_e, value: number) => { }}
              aria-label="basic tabs example"
            >
              <Tooltip title="content edition" arrow>
                <Tab icon={"Game"} />
              </Tooltip>
              <Tooltip title="content visualization" arrow>
                <Tab icon={"Page"} />
              </Tooltip>
              <Tooltip title="content edition" arrow>
                <Tab icon={"Element"} />
              </Tooltip>
            </Tabs>
          </Box>
          <Box sx={{ height: "60px", padding: "20px" }}>
            <TextField
              label="Author"
              variant="outlined"
              value={game.settings.author}
              onChange={(e) => {}}
            />
          </Box>
          <Box sx={{ height: "60px", padding: "20px" }}>
            <TextField
              label="Title"
              variant="outlined"
              value={game.settings.gameTitle}
              onChange={(e) => {}}
            />
          </Box>
        </>
        }
      </div>
    </div >
  </>
}