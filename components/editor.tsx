"use client";

import { useEffect, useRef, useState } from "react";

// Import Editor.js components conditionally to avoid SSR issues
let EditorJS: any = null;
let Header: any = null;
let List: any = null;
let Image: any = null;
let Paragraph: any = null;
let Delimiter: any = null;
let Quote: any = null;
let Code: any = null;
let Embed: any = null;

if (typeof window !== "undefined") {
  EditorJS = require("@editorjs/editorjs");
  Header = require("@editorjs/header");
  List = require("@editorjs/list");
  Image = require("@editorjs/image");
  Paragraph = require("@editorjs/paragraph");
  Delimiter = require("@editorjs/delimiter");
  Quote = require("@editorjs/quote");
  Code = require("@editorjs/code");
  Embed = require("@editorjs/embed");
}

interface EditorProps {
  data?: any;
  onChange?: (data: any) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export default function Editor({
  data,
  onChange,
  readOnly = false,
  placeholder = "Start writing...",
}: EditorProps) {
  const editorRef = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!holderRef.current || !EditorJS) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      data: data || {},
      readOnly,
      placeholder,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: "Enter a header",
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: "/api/v1/articles/temp/images", // This will need to be implemented
              byUrl: "/api/v1/articles/temp/images", // This will need to be implemented
            },
          },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        delimiter: Delimiter,
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        code: Code,
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              vimeo: true,
              twitter: true,
              instagram: true,
            },
          },
        },
      },
      onChange: async () => {
        if (onChange && editorRef.current) {
          try {
            const outputData = await editorRef.current.save();
            onChange(outputData);
          } catch (error) {
            console.error("Saving failed: ", error);
          }
        }
      },
    });

    editorRef.current = editor;

    editor.isReady.then(() => {
      setIsReady(true);
    });

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [data, readOnly, placeholder]);

  useEffect(() => {
    if (editorRef.current && data && isReady) {
      editorRef.current.render(data);
    }
  }, [data, isReady]);

  return (
    <div className="editor-container">
      <div
        ref={holderRef}
        className="min-h-[400px] prose prose-sm max-w-none focus-within:outline-none outline-none"
      />
    </div>
  );
}
