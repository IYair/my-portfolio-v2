"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { forwardRef, useImperativeHandle } from "react";
import TiptapToolbar from "./TiptapToolbar";

interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export interface TiptapEditorRef {
  getHTML: () => string;
  getJSON: () => object;
  setContent: (content: string) => void;
  focus: () => void;
  clear: () => void;
}

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  (
    {
      content = "",
      onChange,
      placeholder = "Comienza a escribir tu contenido...",
      className = "",
      editable = true,
    },
    ref
  ) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
          codeBlock: {
            HTMLAttributes: {
              class: "bg-gray-100 dark:bg-gray-800 rounded-md p-4 font-mono text-sm",
            },
          },
          bulletList: {
            HTMLAttributes: {
              class: "list-disc list-outside ml-4 pl-2",
            },
          },
          orderedList: {
            HTMLAttributes: {
              class: "list-decimal list-outside ml-4 pl-2",
            },
          },
          listItem: {
            HTMLAttributes: {
              class: "ml-2",
            },
          },
        }),
        Placeholder.configure({
          placeholder,
          emptyEditorClass:
            "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-gray-400 before:pointer-events-none",
        }),
        Typography,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class:
              "text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-2 hover:decoration-blue-800 dark:hover:decoration-blue-200 transition-colors",
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: "max-w-full h-auto rounded-lg shadow-sm",
          },
        }),
        Underline,
        Highlight.configure({
          HTMLAttributes: {
            class: "bg-yellow-200 dark:bg-yellow-800 px-1 rounded",
          },
        }),
      ],
      content,
      editable,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);
      },
      editorProps: {
        attributes: {
          class: "prose prose-lg max-w-none focus:outline-none dark:prose-invert min-h-[300px] p-6",
          spellcheck: "false",
        },
        handleDOMEvents: {
          focus: () => {
            // Ensure toolbar buttons work properly when editor is focused
            return false;
          },
        },
      },
    });

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() || "",
      getJSON: () => editor?.getJSON() || {},
      setContent: (content: string) => editor?.commands.setContent(content),
      focus: () => editor?.commands.focus(),
      clear: () => editor?.commands.clearContent(),
    }));

    if (!editor) {
      return (
        <div className="animate-pulse">
          <div className="mb-4 h-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-64 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
        </div>
      );
    }

    return (
      <div
        className={`overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}
      >
        {editable && <TiptapToolbar editor={editor} />}
        <EditorContent
          editor={editor}
          className="tiptap-editor min-h-[300px] focus-within:bg-white dark:focus-within:bg-gray-800"
        />
      </div>
    );
  }
);

TiptapEditor.displayName = "TiptapEditor";

export default TiptapEditor;
