import Prism from 'prismjs';
import EditorModule from 'react-simple-code-editor';

import 'prismjs/themes/prism.css';

const Editor =
  (EditorModule as unknown as { default?: typeof EditorModule }).default ??
  EditorModule;

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function JsCodeEditor({ value, onChange }: Props) {
  return (
    <Editor
      value={value}
      onValueChange={(code) => onChange(code)}
      highlight={(code) => Prism.highlight(code, Prism.languages.js, 'js')}
      padding={10}
      style={{
        backgroundColor: 'lightgrey',
      }}
    />
  );
}
