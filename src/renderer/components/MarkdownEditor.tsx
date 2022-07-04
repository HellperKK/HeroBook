/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import Prism from 'prismjs';
import { useCallback, useMemo } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { Text, createEditor, BaseEditor } from 'slate';
import { withHistory } from 'slate-history';
import { css } from '@emotion/css';

import { useDispatch } from 'react-redux';
import { Page } from '../../utils/initialStuff';

Prism.languages.markdown = Prism.languages.extend('markup', {});
Prism.languages.insertBefore('markdown', 'prolog', {
  blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: 'punctuation' },
  code: [
    { pattern: /^(?: {4}|\t).+/m, alias: 'keyword' },
    { pattern: /``.+?``|`[^`\n]+`/, alias: 'keyword' },
  ],
  title: [
    {
      pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
      alias: 'important',
      inside: { punctuation: /==+$|--+$/ },
    },
    {
      pattern: /(^\s*)#+.+/m,
      lookbehind: !0,
      alias: 'important',
      inside: { punctuation: /^#+|#+$/ },
    },
  ],
  hr: {
    pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
    lookbehind: !0,
    alias: 'punctuation',
  },
  list: {
    pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
    lookbehind: !0,
    alias: 'punctuation',
  },
  'url-reference': {
    pattern:
      /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
    inside: {
      variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 },
      string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
      punctuation: /^[[\]!:]|[<>]/,
    },
    alias: 'url',
  },
  bold: {
    pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: { punctuation: /^\*\*|^__|\*\*$|__$/ },
  },
  italic: {
    pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: { punctuation: /^[*_]|[*_]$/ },
  },
  url: {
    pattern:
      /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
    inside: {
      variable: { pattern: /(!?\[)[^\]]+(?=\]$)/, lookbehind: !0 },
      string: { pattern: /"(?:\\.|[^"\\])*"(?=\)$)/ },
    },
  },
});
(Prism.languages.markdown as any).bold.inside.url = Prism.util.clone(
  Prism.languages.markdown.url
);
(Prism.languages.markdown as any).italic.inside.url = Prism.util.clone(
  Prism.languages.markdown.url
);
(Prism.languages.markdown as any).bold.inside.italic = Prism.util.clone(
  (Prism.languages.markdown as any).italic
);
(Prism.languages.markdown as any).italic.inside.bold = Prism.util.clone(
  (Prism.languages.markdown as any).bold
); // prettier-ignore

type CustomBlock =
  | 'paragraph'
  | 'code'
  | 'heading'
  | 'table'
  | 'text'
  | 'hr'
  | 'ol'
  | 'ul'
  | 'th'
  | 'td';

type CustomText = { text: string };
type CustomElement = { type: CustomBlock; children: CustomText[] };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const Leaf = ({ attributes, children, leaf }: any) => {
  return (
    <span
      {...attributes}
      className={css`
        font-weight: ${leaf.bold && 'bold'};
        font-style: ${leaf.italic && 'italic'};
        text-decoration: ${leaf.underlined && 'underline'};
        ${leaf.title &&
        css`
          display: inline-block;
          font-weight: bold;
          font-size: 20px;
          margin: 20px 0 10px 0;
        `}
        ${leaf.list &&
        css`
          padding-left: 10px;
          font-size: 20px;
          line-height: 10px;
        `}
        ${leaf.hr &&
        css`
          display: block;
          text-align: center;
          border-bottom: 2px solid #ddd;
        `}
        ${leaf.blockquote &&
        css`
          display: inline-block;
          border-left: 2px solid #ddd;
          padding-left: 10px;
          color: #aaa;
          font-style: italic;
        `}
        ${leaf.code &&
        css`
          font-family: monospace;
          padding: 3px;
        `}
      `}
    >
      {children}
    </span>
  );
};

interface EditorProps {
  page: Page;
}

const MarkdownEditor = (propss: EditorProps) => {
  const { page } = propss;
  const dispatch = useDispatch();

  const code: CustomElement[] = [
    {
      type: 'paragraph',
      children: [
        {
          text: page.text,
        },
      ],
    },
  ];

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const decorate = useCallback(([node, path]) => {
    const ranges: any[] = [];

    if (!Text.isText(node)) {
      return ranges;
    }

    const getLength = (token: any) => {
      if (typeof token === 'string') {
        return token.length;
      }
      if (typeof token.content === 'string') {
        return token.content.length;
      }
      return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    tokens.forEach((token) => {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== 'string') {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    });

    return ranges;
  }, []);

  return (
    <Slate editor={editor} value={code}>
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        placeholder="Write some markdown..."
        onInput={() => {
          dispatch({
            type: 'changePage',
            page: {
              text: '',
            },
          });
        }}
      />
    </Slate>
  );
};

export default MarkdownEditor;
