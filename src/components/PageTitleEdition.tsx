import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePageAt } from "../store/gameSlice";

interface CompProp {
  pagePosition: number;
  pageTitle: string;
}

export default function PageTitleEdition(props: CompProp) {
  const dispatch = useDispatch();

  const { pagePosition, pageTitle } = props;
  const [editing, setEditing] = useState(false);

  return editing ? (
    <TextField
      sx={
        {
          width: "200px",
        }
      }
      onBlur={() => {
        setEditing(false);
      }}
      autoFocus
      label="Page Title"
      variant="outlined"
      value={pageTitle}
      onChange={(e) =>
        dispatch(changePageAt({ page: { name: e.target.value }, position: pagePosition }))
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.shiftKey) {
          setEditing(false);
        }
      }}
    />
  ) : (
    <Typography
      sx={
        {
          width: "200px",
          height: "24px",
          overflow: "hidden"
        }
      }
      onClick={(e) => {
        if (e.detail == 2) {
          setEditing(true);
        }
      }}
    >
      {pageTitle}
    </Typography>
  );
}
