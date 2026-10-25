import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onImageInsertRequest?: () => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  onImageInsertRequest,
  placeholder = 'बातमीचा सविस्तर मजकूर येथे लिहा...',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-crimson-800 underline',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'tiptap-content min-h-[300px] max-h-[600px] overflow-y-auto px-4 py-3 bg-white focus:outline-none text-editorial-900 leading-relaxed font-sans text-base',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL प्रविष्ट करा:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImageByPrompt = () => {
    if (onImageInsertRequest) {
      onImageInsertRequest();
      return;
    }
    const url = window.prompt('प्रतिमेची थेट URL प्रविष्ट करा:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-editorial-300 rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-crimson-800 focus-within:border-crimson-800 transition-all">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-paper-subtle border-b border-editorial-200 text-editorial-700">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('bold') ? 'bg-white text-crimson-800 shadow-xs font-bold' : ''}`}
          title="ठळक (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('italic') ? 'bg-white text-crimson-800 shadow-xs' : ''}`}
          title="तिरपे (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <span className="w-[1px] h-4 bg-editorial-300 mx-1"></span>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-white text-crimson-800 shadow-xs font-bold' : ''}`}
          title="शीर्षक २ (Heading 2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-white text-crimson-800 shadow-xs font-bold' : ''}`}
          title="उपशीर्षक ३ (Heading 3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-[1px] h-4 bg-editorial-300 mx-1"></span>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('bulletList') ? 'bg-white text-crimson-800 shadow-xs' : ''}`}
          title="बुलेट यादी (Bullet List)"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('orderedList') ? 'bg-white text-crimson-800 shadow-xs' : ''}`}
          title="क्रमांकित यादी (Numbered List)"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('blockquote') ? 'bg-white text-crimson-800 shadow-xs' : ''}`}
          title="अवतरण चिन्ह / कोट (Blockquote)"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-[1px] h-4 bg-editorial-300 mx-1"></span>

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded hover:bg-white transition-colors ${editor.isActive('link') ? 'bg-white text-crimson-800 shadow-xs' : ''}`}
          title="लिंक जोडा (Add Link)"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addImageByPrompt}
          className="p-1.5 rounded hover:bg-white transition-colors text-editorial-700"
          title="प्रतिमा घाला (Insert Image)"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-1.5 rounded hover:bg-white disabled:opacity-30 transition-colors"
            title="पूर्ववत करा (Undo)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-1.5 rounded hover:bg-white disabled:opacity-30 transition-colors"
            title="पुन्हा करा (Redo)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
};
