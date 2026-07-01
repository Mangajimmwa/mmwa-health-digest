import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Youtube from "@tiptap/extension-youtube";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="min-h-[400px] rounded-md border border-border bg-surface-1 p-6 text-sm text-text-mute">
        Loading editor…
      </div>
    );
  }
  return <EditorInner value={value} onChange={onChange} />;
}

function EditorInner({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing the story… Use the toolbar to format.",
      }),
      CharacterCount,
      Youtube.configure({ nocookie: true, width: 720, height: 405 }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose-article focus:outline-none min-h-[400px] max-w-none px-6 py-6",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value && !editor.isFocused) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const words = editor.storage.characterCount.words();
  const read = Math.max(1, Math.round(words / 220));

  return (
    <div className="rounded-md border border-border bg-surface-1 overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-text-mute">
        <span>
          {words} words · ~{read} min read
        </span>
        <span>Rich text · autosaves as you type</span>
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function onImageChoose(f: File) {
    try {
      const ext = f.name.split(".").pop() || "jpg";
      const path = `inline/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("article-media")
        .upload(path, f, { contentType: f.type });
      if (error) throw error;
      const url = `/api/public/media/${path}`;
      await supabase.from("media").insert({
        path,
        url,
        filename: f.name,
        mime_type: f.type,
        size_bytes: f.size,
      });
      const caption = window.prompt("Optional caption (leave blank to skip):") || "";
      const figure = caption
        ? `<figure><img src="${url}" alt="${escapeAttr(
            caption,
          )}" /><figcaption>${escapeHtml(caption)}</figcaption></figure>`
        : `<figure><img src="${url}" alt="" /></figure>`;
      editor.chain().focus().insertContent(figure).run();
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed. Confirm you're signed in as admin.");
    }
  }

  function insertVideo() {
    const raw = window.prompt("Paste a YouTube or Vimeo URL:");
    if (!raw) return;
    const url = raw.trim();
    if (/youtube\.com|youtu\.be/i.test(url)) {
      editor.commands.setYoutubeVideo({ src: url });
      return;
    }
    const vimeo = url.match(/vimeo\.com\/(\d+)/i);
    if (vimeo) {
      const iframe = `<div class="video-embed"><iframe src="https://player.vimeo.com/video/${vimeo[1]}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen frameborder="0"></iframe></div>`;
      editor.chain().focus().insertContent(iframe).run();
      return;
    }
    toast.error("Only YouTube or Vimeo URLs are supported.");
  }

  function setLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
      .run();
  }

  const btn =
    "inline-flex items-center justify-center w-8 h-8 rounded text-text-body hover:bg-gold/15 hover:text-gold transition-colors disabled:opacity-40";
  const on = "bg-gold/20 text-gold";

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-[#0F0F0F] px-2 py-2">
      <Group>
        <button
          type="button"
          className={`${btn} ${
            editor.isActive("heading", { level: 2 }) ? on : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`${btn} ${
            editor.isActive("heading", { level: 3 }) ? on : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </Group>
      <Group>
        <button
          type="button"
          className={`${btn} ${editor.isActive("bold") ? on : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`${btn} ${editor.isActive("italic") ? on : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`${btn} ${editor.isActive("underline") ? on : ""}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`${btn} ${editor.isActive("strike") ? on : ""}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </Group>
      <Group>
        <button
          type="button"
          className={`${btn} ${editor.isActive("bulletList") ? on : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bulleted list"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`${btn} ${editor.isActive("orderedList") ? on : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`${btn} ${editor.isActive("blockquote") ? on : ""}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Pull quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus className="w-4 h-4" />
        </button>
      </Group>
      <Group>
        <button
          type="button"
          className={`${btn} ${editor.isActive("link") ? on : ""}`}
          onClick={setLink}
          title="Insert link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          title="Remove link"
        >
          <Unlink className="w-4 h-4" />
        </button>
      </Group>
      <Group>
        <button
          type="button"
          className={`${btn} ${
            editor.isActive({ textAlign: "left" }) ? on : ""
          }`}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`${btn} ${
            editor.isActive({ textAlign: "center" }) ? on : ""
          }`}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`${btn} ${
            editor.isActive({ textAlign: "right" }) ? on : ""
          }`}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </Group>
      <Group>
        <button
          type="button"
          className={btn}
          onClick={() => fileRef.current?.click()}
          title="Insert image at cursor"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onImageChoose(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className={btn}
          onClick={insertVideo}
          title="Insert YouTube/Vimeo"
        >
          <YoutubeIcon className="w-4 h-4" />
        </button>
      </Group>
      <Group>
        <button
          type="button"
          className={btn}
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </Group>
    </div>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 border-r border-border pr-1 last:border-r-0">
      {children}
    </div>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function escapeAttr(s: string) {
  return escapeHtml(s);
}
