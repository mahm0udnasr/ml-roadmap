"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

interface RichTextEditorProps {
  content?: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  readOnly = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content || "<p></p>",
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (!readOnly) {
        onChange(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return <div className="text-zinc-400">Loading editor...</div>;
  }

  const ButtonClass =
    "px-3 py-1.5 rounded text-xs font-medium transition bg-white/10 hover:bg-white/20 text-white border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-3">
      {!readOnly && (
        <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`${ButtonClass} ${editor.isActive("bold") ? "bg-[#8b5cf6]/30" : ""}`}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`${ButtonClass} ${editor.isActive("italic") ? "bg-[#8b5cf6]/30" : ""}`}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <div className="w-px bg-white/20" />
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`${ButtonClass} ${editor.isActive("heading", { level: 2 }) ? "bg-[#8b5cf6]/30" : ""}`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`${ButtonClass} ${editor.isActive("heading", { level: 3 }) ? "bg-[#8b5cf6]/30" : ""}`}
            title="Heading 3"
          >
            H3
          </button>
          <div className="w-px bg-white/20" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${ButtonClass} ${editor.isActive("bulletList") ? "bg-[#8b5cf6]/30" : ""}`}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${ButtonClass} ${editor.isActive("orderedList") ? "bg-[#8b5cf6]/30" : ""}`}
            title="Numbered List"
          >
            1. List
          </button>
          <div className="w-px bg-white/20" />
          <button
            type="button"
            onClick={() => {
              const url = window.prompt("Enter link URL:");
              if (url) {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: url })
                  .run();
              }
            }}
            className={`${ButtonClass} ${editor.isActive("link") ? "bg-[#8b5cf6]/30" : ""}`}
            title="Add Link"
          >
            🔗 Link
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            className={ButtonClass}
            title="Remove Link"
          >
            Unlink
          </button>
        </div>
      )}
      <div
        className={`prose prose-invert max-w-none rounded-lg border transition ${
          readOnly
            ? "border-white/10 bg-transparent p-4"
            : "border-white/20 bg-white/5 focus-within:border-[#8b5cf6]/50 p-4"
        }`}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
