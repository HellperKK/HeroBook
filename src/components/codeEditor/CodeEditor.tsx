import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Editor, EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import { lowlight } from 'lowlight'
import markdown from 'highlight.js/lib/languages/markdown'

import './codeColor.css'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'


lowlight.registerLanguage('ejs', (api) => {
    const md = markdown(api);
    const newTokens = [
        {
            className: 'code-expression',
            begin: '<%=',
            end: '%>'
        },
        {
            className: 'code-comment',
            begin: '<%#',
            end: '%>'
        },
        {
            className: 'code-ejs',
            begin: '<%',
            end: '%>'
        },
    ]

    md.contains.unshift(...newTokens);
    console.log("md est ", md);
    return md;
})

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null
    }

    return (
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>
            code block
        </button>
    )
}

interface Props {
    content: string;
    onUpdate: (content: string) => void
}

export default function CodeEditor({ content, onUpdate }: Props) {
    const { selectedPage } = useSelector((state: RootState) => state.game);

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            CodeBlockLowlight
                .configure({ defaultLanguage: 'ejs', lowlight, }),
        ],
        content: `<pre>${content}</pre>`,
        onTransaction: ({ editor }) => {
            onUpdate(editor.getText());
        }
    }, [selectedPage]);

    editor?.commands.setCodeBlock({ language: "ejs" });

    return (
        <div>
            <EditorContent editor={editor} />
        </div>
    )
}