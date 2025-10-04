"use client";

import { Editor } from "@tiptap/react";
import { useCallback } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeBracketIcon,
  ListBulletIcon,
  NumberedListIcon,
  ChatBubbleLeftIcon,
  LinkIcon,
  PhotoIcon,
  PaintBrushIcon,
  Bars3BottomLeftIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";

interface TiptapToolbarProps {
  editor: Editor;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: ToolbarButtonProps) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent losing focus from editor
    onClick();
  };

  return (
    <button
      type="button"
      onMouseDown={handleMouseDown}
      disabled={disabled}
      title={title}
      className={`rounded-md p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
        isActive
          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-400"
      } ${
        disabled ? "cursor-not-allowed opacity-50" : "hover:text-gray-900 dark:hover:text-white"
      } focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none`}
    >
      {children}
    </button>
  );
};

const Divider = () => <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />;

export default function TiptapToolbar({ editor }: TiptapToolbarProps) {
  const addImage = useCallback(() => {
    const url = window.prompt("URL de la imagen:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL del enlace:", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-wrap items-center gap-1">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Deshacer (Ctrl+Z)"
        >
          <ArrowUturnLeftIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rehacer (Ctrl+Y)"
        >
          <ArrowUturnRightIcon className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Negrita (Ctrl+B)"
        >
          <BoldIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Cursiva (Ctrl+I)"
        >
          <ItalicIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Subrayado (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Tachado"
        >
          <StrikethroughIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          title="Resaltar"
        >
          <PaintBrushIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Código inline"
        >
          <CodeBracketIcon className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Título 1"
        >
          <span className="text-lg font-bold">H1</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Título 2"
        >
          <span className="font-bold">H2</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Título 3"
        >
          <span className="text-sm font-semibold">H3</span>
        </ToolbarButton>

        <Divider />

        {/* Lists and Blocks */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Lista con viñetas"
        >
          <ListBulletIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          <NumberedListIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Cita"
        >
          <ChatBubbleLeftIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Bloque de código"
        >
          <Bars3BottomLeftIcon className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Media and Links */}
        <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} title="Insertar enlace">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Insertar imagen">
          <PhotoIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );
}
