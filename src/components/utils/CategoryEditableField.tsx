import TextField from "@mui/material/TextField";

import { useRef, useState } from "react";

interface CompProp {
  content: string;
  label: string;
  onChange: (
    content: string
  ) => void;
}

export default function CategoryEditableField(props: CompProp) {
  const { content, label, onChange } = props;
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLInputElement>()


  return editing ? (
    <TextField
      onBlur={() => {
        if (ref.current !== undefined) {
          onChange(ref.current.value)
        }
        setEditing(false);
      }}
      autoFocus
      label={label}
      variant="outlined"
      inputRef={ref}
      defaultValue={content}
      // onChange={onChange}
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
