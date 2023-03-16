import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useState } from "react";
import { useDispatch } from "react-redux";

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
      onBlur={() => {
        setEditing(false);
      }}
      autoFocus
      label="Page Title"
      variant="outlined"
      value={pageTitle}
      onChange={(e) =>
        dispatch({
          type: "changePageAt",
          page: { name: e.target.value },
          position: pagePosition,
        })
      }
    />
  ) : (
    <Typography
      onClick={(e) => {
        if (e.detail == 2) {
          // setEditing(true);
        }
      }}
    >
      {pageTitle}
    </Typography>
  );
}
