import TextField from "@mui/material/TextField";

import { useState } from "react";

interface CompProp {
  content: string;
  label: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function CategoryEditableField(props: CompProp) {
  const { content, label, onChange } = props;
  const [editing, setEditing] = useState(true);

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
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.shiftKey) {
          setEditing(false);
        }
      }}
    />
  ) : (
    <span
      onClick={(e) => {
        if (e.detail == 2) {
          setEditing(true);
        }
      }}
    >{content}</span>
  );
}
