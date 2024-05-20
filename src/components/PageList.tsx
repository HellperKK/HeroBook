import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "../utils/initialStuff";
import { Button, List, ListItem, Tooltip } from "@mui/material";
import PageTitleEdition from "./PageTitleEdition";

import FlagSharpIcon from "@mui/icons-material/FlagSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import Space from "./utils/Space";
import { addPage, removePage } from "../store/gameSlice";

export default function PageList() {
  const { game, expert } = useSelector((state: RootState) => state.game);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedPage = game.pages.find(page => page.id === parseInt(id!, 10))!;
  const visibleCategories = (game.settings.categories ?? []).filter(category => category.visible);
  

  const defineColor = (page: Page) => {
    if (page.id === selectedPage.id) return "secondary.light";

    return "";
  };

  return (<List sx={{ overflow: "auto" }}>
  {game.pages
    .filter(page => page.category === undefined ||
      page.category === "" ||
      visibleCategories.some(category => category.name === page.category)
    ).map((page, index) => (
      <ListItem
        onClick={() => {
          navigate(`/editor/${page.id}`)
        }}
        key={page.id}
        sx={{
          bgcolor: defineColor(page),
          cursor: "pointer",
        }}
      >
        <PageTitleEdition pagePosition={index} pageTitle={page.name} />
        { page.isFirst && <FlagSharpIcon
                sx={{
                  color: "black",
                }}
              />}
        <Space size={2} />
        <Tooltip title="delete page" arrow>
          <Button
            variant="contained"
            disabled={game.pages.length === 1}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(removePage({removeId: page.id}));

              /*if (page === selectedPage) {
                const id = game.pages[0].id
                navigate(`/editor/${id}`)
              }*/
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
          dispatch(addPage(""))
        }
      >
        <AddSharpIcon />
      </Button>
    </Tooltip>
  </ListItem>
</List>)
}