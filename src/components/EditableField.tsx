import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { safeMarkdown } from "../utils/utils";

interface CompProp {
  pagePosition: number;
  content: string;
  label: string;
  multiline?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function EditableField(props: CompProp) {
  const { pagePosition, content, label, onChange } = props;
  const [editing, setEditing] = useState(false);

  const multiline = props.multiline ?? false;

  return editing ? (
    <TextField
      onBlur={() => {
        setEditing(false);
      }}
      autoFocus
      label={label}
      variant="outlined"
      value={content}
      onChange={onChange}
      multiline={multiline}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.shiftKey) {
          setEditing(false);
        }
      }}
    />
  ) : (
    <p
      onClick={(e) => {
        // if (e.detail == 2) {
        setEditing(true);
        // }
      }}
      dangerouslySetInnerHTML={{ __html: safeMarkdown(content) }}
    />
  );
}