import TextField from "@mui/material/TextField";

import { useState } from "react";
import ejs from "ejs";

import { safeMarkdown } from "../../utils/utils";

interface CompProp {
  content: string;
  label: string;
  multiline?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  state: any;
}

export default function EditableField(props: CompProp) {
  const { content, label, onChange, state } = props;
  const [editing, setEditing] = useState(false);

  const multiline = props.multiline ?? false;

  let body = safeMarkdown(content);
  try {
    body = safeMarkdown(ejs.render(content, state));
  } catch (error) {

  }

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
      sx={{ width: multiline ? "100%" : "initial" }}
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
      dangerouslySetInnerHTML={{
        __html: safeMarkdown(body),
      }}
    />
  );
}
