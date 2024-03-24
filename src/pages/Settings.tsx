import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
// import PriorityHighSharpIcon from '@mui/icons-material/PriorityHighSharp';

import { useSelector, useDispatch } from "react-redux";

import { setFirst, updateGlobalFormat, updateSettings, updateTexts } from "../store/gameSlice";
import { RootState } from "../store/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { initialTexts } from "../utils/initialStuff";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import styled from "@emotion/styled";
import ColorPicker from "../components/utils/ColorPicker";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";

const FixedTypo = styled(Typography)`
  width: 100px;
`;

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { game } = useSelector((state: RootState) => state.game);

  const fistPage = game.pages.find(page => page.isFirst)!;

  return (
    <Box sx={{ padding: "8px", backgroundColor: "white", overflowY: "scroll" }}>
      <Container>
        <Link to={`/editor/${game.pages[0].id}`}>Back to editor</Link>
        <Typography variant="h2">Settings</Typography>
        <Typography variant="h3">Parameters</Typography>
        <Box sx={{ height: "60px", paddingTop: "20px" }}>
          <TextField
            label="Author"
            variant="outlined"
            value={game.settings.author}
            onChange={(e) =>
              dispatch(updateSettings({ author: e.target.value }))
            }
          />
        </Box>
        <Box sx={{ height: "60px", paddingTop: "20px" }}>
          <TextField
            label="Title"
            variant="outlined"
            value={game.settings.gameTitle}
            onChange={(e) =>
              dispatch(updateSettings({ gameTitle: e.target.value }))
            }
          />
        </Box>
        <Typography variant="h3">Game texts</Typography>
        <Box sx={{ height: "60px", paddingTop: "20px" }}>
          <TextField
            label="Play"
            variant="outlined"
            value={game.settings.texts?.play ?? initialTexts.play}
            onChange={(e) =>
              dispatch(updateTexts({ play: e.target.value }))
            }
          />
        </Box>
        <Box sx={{ height: "60px", paddingTop: "20px" }}>
          <TextField
            label="Continue"
            variant="outlined"
            value={game.settings.texts?.continue ?? initialTexts.continue}
            onChange={(e) =>
              dispatch(updateTexts({ continue: e.target.value }))
            }
          />
        </Box>
        <Box sx={{ height: "60px", paddingTop: "20px" }}>
          <TextField
            label="Quit"
            variant="outlined"
            value={game.settings.texts?.quit ?? initialTexts.quit}
            onChange={(e) =>
              dispatch(updateTexts({ quit: e.target.value }))
            }
          />
        </Box>
        <Box sx={{ height: "60px", paddingTop: "20px" }}>
          <TextField
            label="Menu"
            variant="outlined"
            value={game.settings.texts?.menu ?? initialTexts.menu}
            onChange={(e) =>
              dispatch(updateTexts({ menu: e.target.value }))
            }
          />
        </Box>
        <Typography variant="h3">Colors</Typography>
        <Box>
          <Stack direction="row" spacing={1}>
            <FixedTypo>Text</FixedTypo>
            <ColorPicker
              value={game.format.textColor ?? game.format.textColor}
              onChange={(color) => dispatch(updateGlobalFormat({ textColor: color }))}
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            <FixedTypo>Choice</FixedTypo>
            <ColorPicker
              value={game.format.btnColor ?? game.format.btnColor}
              onChange={(color) => updateGlobalFormat({ btnColor: color })}
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            <FixedTypo>Page</FixedTypo>
            <ColorPicker
              value={game.format.page ?? game.format.page}
              onChange={(color) => updateGlobalFormat({ page: color })}
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            <FixedTypo>Background</FixedTypo>
            <ColorPicker
              value={game.format.background ?? game.format.background}
              onChange={(color) => updateGlobalFormat({ background: color })}
            />
          </Stack>
          <Typography variant="h3">Starting page</Typography>
          <Container>
            <Select
              value={fistPage.id}
              sx={{ width: "30%" }}
            >
              {game.pages.map((pa) => (
                <MenuItem
                  key={pa.id}
                  value={pa.id}
                  onClick={() =>
                    dispatch(setFirst(pa.id))
                  }
                >
                  {pa.name}
                </MenuItem>
              ))}
            </Select>
          </Container>
        </Box>
      </Container>
    </Box >
  );
}
