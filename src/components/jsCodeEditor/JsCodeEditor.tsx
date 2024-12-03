import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import { lowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'

import './codeColor.css'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

lowlight.registerLanguage('javascript', javascript)

interface Props {
    content: string;
    onUpdate: (content: string) => void
}

export default function JsCodeEditor({ content, onUpdate }: Props) {
    const {  resetBool } = useSelector((state: RootState) => state.game);
    const { id } = useParams();

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            CodeBlockLowlight
                .configure({ defaultLanguage: 'javascript', lowlight }),
        ],
        content: `<pre>${content}</pre>`,
        onUpdate: ({ editor }) => {
            onUpdate(editor.getText());
        }
    }, [id, resetBool])!;

    return (
        <div>
            <EditorContent editor={editor} />
        </div>
    )
}