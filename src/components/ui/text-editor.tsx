"use client";

import { Editor, type IAllProps } from "@tinymce/tinymce-react";
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { getSiteHostname } from "@/config/site";
import { filesApi } from "@/lib/api/files";
import { getImageUrl } from "@/utils/image";

// Type for TinyMCE editor instance
type TinyMCEEditor = Parameters<
  NonNullable<React.ComponentProps<typeof Editor>["onInit"]>
>[1];

export interface TextEditorProps
  extends Omit<IAllProps, "licenseKey" | "init" | "initialValue" | "onChange" | "onInit"> {
  /**
   * The initial content of the editor
   */
  initialValue?: string;

  /**
   * Controlled value for the editor content
   */
  value?: string;

  /**
   * Callback fired when the editor content changes
   */
  onChange?: (content: string, editor: TinyMCEEditor) => void;

  /**
   * Callback fired when the editor is initialized
   */
  onInit?: (editor: TinyMCEEditor) => void;

  /**
   * Height of the editor in pixels
   * @default 600
   */
  height?: number;

  /**
   * Placeholder text when editor is empty
   */
  placeholder?: string;

  /**
   * Custom CSS classes to apply to the editor container
   */
  className?: React.ComponentProps<"div">["className"];

  /**
   * Whether to show the menubar
   * @default true
   */
  showMenubar?: boolean;

  /**
   * Preset configuration for different use cases
   * @default 'full'
   */
  preset?: "minimal" | "basic" | "full";

  /**
   * Override any TinyMCE configuration options
   */
  configOverrides?: Record<string, unknown>;

  /**
   * Object ID for uploaded images (associates uploads with a specific entity)
   */
  uploadObjectId?: number | string;

  /**
   * Object type for uploaded images
   * @default 'posts'
   */
  uploadObjectType?: string;
}

/**
 * Methods exposed via ref
 */
export interface TextEditorRef {
  /**
   * Get the current editor content
   */
  getContent: () => string;

  /**
   * Set the editor content
   */
  setContent: (content: string) => void;

  /**
   * Focus the editor
   */
  focus: () => void;

  /**
   * Get the raw TinyMCE editor instance
   */
  getEditor: () => TinyMCEEditor | null;
}

/**
 * Preset configurations for different use cases
 */
const PRESETS = {
  minimal: {
    plugins: ["lists", "link", "autolink"],
    toolbar: [
      {
        name: "formatting",
        items: ["bold", "italic", "underline"],
      },
      {
        name: "lists",
        items: ["bullist", "numlist"],
      },
      {
        name: "insert",
        items: ["link"],
      },
    ],
  },
  basic: {
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "searchreplace",
      "code",
      "fullscreen",
      "table",
      "help",
      "wordcount",
    ],
    toolbar: [
      {
        name: "history",
        items: ["undo", "redo"],
      },
      {
        name: "styles",
        items: ["blocks"],
      },
      {
        name: "formatting",
        items: ["bold", "italic", "underline"],
      },
      {
        name: "alignment",
        items: ["alignleft", "aligncenter", "alignright"],
      },
      {
        name: "lists",
        items: ["bullist", "numlist"],
      },
      {
        name: "insert",
        items: ["link", "image", "table"],
      },
    ],
  },
  full: {
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "visualchars",
      "code",
      "codesample",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "help",
      "wordcount",
      "emoticons",
      "quickbars",
      "nonbreaking",
      "pagebreak",
      "directionality",
    ],
    toolbar: [
      {
        name: "history",
        items: ["undo", "redo"],
      },
      {
        name: "styles",
        items: ["fontfamily", "fontsize", "blocks"],
      },
      {
        name: "formatting",
        items: ["bold", "italic", "underline", "strikethrough"],
      },
      {
        name: "colors",
        items: ["forecolor", "backcolor", "removeformat"],
      },
      {
        name: "alignment",
        items: ["alignleft", "aligncenter", "alignright", "alignjustify"],
      },
      {
        name: "lists",
        items: ["bullist", "numlist", "outdent", "indent"],
      },
      {
        name: "insert",
        items: ["link", "anchor", "image", "media", "table", "emoticons"],
      },
      {
        name: "tools",
        items: ["searchreplace", "visualblocks", "visualchars", "code", "codesample"],
      },
      {
        name: "special",
        items: ["charmap", "nonbreaking", "pagebreak"],
      },
      {
        name: "utilities",
        items: ["fullscreen", "help"],
      },
    ],
  },
} as const;

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn-v2.didongviet.vn";

function getCorsHostnames(): string[] {
  const siteHost = getSiteHostname();
  const cdnHost = (() => {
    try {
      return new URL(CDN_URL).hostname;
    } catch {
      return "";
    }
  })();
  return [siteHost, cdnHost].filter(Boolean);
}

/**
 * A feature-rich text editor component built on TinyMCE.
 * Supports customizable toolbars, presets, and image upload integration.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TextEditor onChange={(content) => {}} />
 *
 * // Controlled component
 * <TextEditor value={content} onChange={setContent} />
 *
 * // With ref for imperative actions
 * const editorRef = useRef<TextEditorRef>(null);
 * <TextEditor ref={editorRef} />
 * editorRef.current?.focus();
 *
 * // Minimal preset for simple editing
 * <TextEditor preset="minimal" />
 * ```
 */
export const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(
  (
    {
      initialValue = "",
      value,
      onChange,
      onInit,
      height = 600,
      placeholder,
      className,
      showMenubar = true,
      preset = "full",
      configOverrides = {},
      uploadObjectId = 0,
      uploadObjectType = "posts",
      ...props
    },
    ref
  ) => {
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const lastValueRef = useRef<string | undefined>(undefined);

    // Only render editor on client side to avoid hydration mismatch
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Sync value prop into editor when it changes (e.g. after async load)
    useEffect(() => {
      if (value === undefined || value === lastValueRef.current) return;
      lastValueRef.current = value;
      const editor = editorRef.current;
      if (editor && editor.getContent() !== value) {
        editor.setContent(value ?? "");
      }
    }, [value]);

    // Expose imperative methods via ref
    useImperativeHandle(ref, () => ({
      getContent: () => {
        return editorRef.current?.getContent() ?? "";
      },
      setContent: (content: string) => {
        editorRef.current?.setContent(content);
      },
      focus: () => {
        editorRef.current?.focus();
      },
      getEditor: () => {
        return editorRef.current;
      },
    }));

    const handleEditorChange = (content: string, editor: TinyMCEEditor) => {
      onChange?.(content, editor);
    };

    const handleInit = (_evt: unknown, editor: TinyMCEEditor) => {
      editorRef.current = editor;
      onInit?.(editor);
    };

    // Custom image upload handler
    const handleImageUpload = (
      blobInfo: { blob: () => Blob; filename: () => string },
      progress: (percent: number) => void
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        const file = new File([blobInfo.blob()], blobInfo.filename(), {
          type: blobInfo.blob().type,
        });

        // Show initial progress
        progress(0);
        setIsUploading(true);

        filesApi
          .upload(file, {
            object: uploadObjectType,
            object_id: uploadObjectId.toString(),
          })
          .then((response) => {
            progress(100);
            setIsUploading(false);
            if (response.path) {
              resolve(getImageUrl(response.path));
            } else {
              reject({
                message: "No path returned from upload",
                remove: true,
              });
            }
          })
          .catch((error) => {
            setIsUploading(false);
            reject({
              message: error?.message || "Upload failed",
              remove: true,
            });
          });
      });
    };

    // Custom file picker callback
    const handleFilePicker = (
      callback: (url: string, meta?: { alt?: string; title?: string }) => void,
      _value: string,
      meta: Record<string, any>
    ) => {
      // Create a file input element
      const input = document.createElement("input");
      input.setAttribute("type", "file");

      // Set accepted file types based on meta.filetype
      if (meta.filetype === "image") {
        input.setAttribute("accept", "image/*");
      } else if (meta.filetype === "media") {
        input.setAttribute("accept", "video/*,audio/*");
      } else {
        input.setAttribute("accept", "*/*");
      }

      // Handle file selection
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
          const response = await filesApi.upload(file, {
            object: uploadObjectType,
            object_id: uploadObjectId.toString(),
          });

          if (response.path) {
            callback(getImageUrl(response.path), {
              alt: file.name,
              title: file.name,
            });
          }
        } catch (error) {
        } finally {
          setIsUploading(false);
        }
      };

      // Trigger file selection
      input.click();
    };

    const selectedPreset = PRESETS[preset as keyof typeof PRESETS];
    const cdnHostname = new URL(CDN_URL).hostname;

    // Don't render editor on server side to avoid hydration mismatch
    if (!isMounted) {
      return (
        <div className={className}>
          <div className="min-h-[300px] px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
            <div className="text-gray-500">Đang tải editor...</div>
          </div>
        </div>
      );
    }

    return (
      <div className={className}>
        {isUploading && (
          <div className="mb-2 text-sm text-blue-600">Đang tải lên...</div>
        )}
        <Editor
         {...props}
         initialValue={value !== undefined && value !== null ? value : initialValue}
         value={value}
         onEditorChange={handleEditorChange}
         onInit={handleInit}
         tinymceScriptSrc="/tinymce/tinymce.min.js"
         licenseKey="gpl"
         init={{
           base_url: '/tinymce',
           suffix: '.min',
           height,
           menubar: showMenubar ? 'view insert format table tools' : false,
           entity_encoding: 'raw',
           placeholder,

           // Dark mode support
           skin: 'oxide',
           content_css: 'default',

           // Color picking - dynamically from theme
           color_cols: 8,
           custom_colors: true,
           color_map: [
             // Row 1 - DDV Brand Colors & Primary Colors
             '#BE1E2D',
             'DDV Red',
             '#22313f',
             'Black',
             '#FFFFFF',
             'White',
             '#808080',
             'Gray',
             '#FF0000',
             'Red',
             '#FFA500',
             'Orange',
             '#FFFF00',
             'Yellow',
             '#008000',
             'Green',
             // Row 2 - Extended Colors
             '#0000FF',
             'Blue',
             '#4B0082',
             'Indigo',
             '#EE82EE',
             'Violet',
             '#FFC0CB',
             'Pink',
             '#A52A2A',
             'Brown',
             '#800080',
             'Purple',
             '#00FFFF',
             'Cyan',
             '#FF00FF',
             'Magenta',
             // Row 3 - Light Shades
             '#F5F5F5',
             'Light Gray',
             '#EEEEEE',
             'Lighter Gray',
             '#E0E0E0',
             'Silver',
             '#BDBDBD',
             'Medium Gray',
             '#9E9E9E',
             'Dark Gray',
             '#757575',
             'Darker Gray',
             '#616161',
             'Charcoal',
             '#424242',
             'Dark Charcoal',
             // Row 4 - Semantic Colors (Success, Warning, Danger, Info)
             '#52C41A',
             'Success Green',
             '#FAAD14',
             'Warning Orange',
             '#F5222D',
             'Danger Red',
             '#1890FF',
             'Info Blue',
             '#722ED1',
             'Purple',
             '#13C2C2',
             'Cyan',
             '#FA8C16',
             'Orange',
             '#2F54EB',
             'Geek Blue',
           ],
           color_default_foreground: '#BE1E2D',
           color_default_background: '#FFFF00',

           // Apply preset configuration
           plugins: selectedPreset.plugins as any,
           toolbar: selectedPreset.toolbar as any,

           toolbar_mode: 'sliding',
           toolbar_sticky: true,

           // Enhanced formatting options
           block_formats:
             'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre',
           fontsize_formats:
             '8px 10px 12px 14px 16px 18px 20px 24px 30px 36px 48px',


           // SEO-focused link configuration
           link_rel_list: [
             { title: 'No Follow', value: 'nofollow' },
             { title: 'Sponsored', value: 'sponsored' },
             { title: 'UGC', value: 'ugc' },
             { title: 'No Opener', value: 'noopener' },
             { title: 'No Referrer', value: 'noreferrer' },
           ],
           link_title: true,
           link_target_list: [
             { title: 'None', value: '' },
             { title: 'Same page', value: '_self' },
             { title: 'New window', value: '_blank' },
           ],
           default_link_target: '_blank',
           link_assume_external_targets: true,

           // SEO-focused image configuration
           image_title: true,
           image_description: true,
           image_dimensions: true,
           image_advtab: true,
           image_caption: true,

           // Custom image upload handler
           images_upload_handler: handleImageUpload,
           automatic_uploads: true,
           images_reuse_filename: true,

           // Custom file picker for browse button
           file_picker_callback: handleFilePicker,
           file_picker_types: 'file image media',

           // CORS support for images - allow site host + CDN host
           images_cors_hosts: getCorsHostnames(),
           editimage_cors_hosts: getCorsHostnames(),

           // Anchor configuration for internal linking
           anchor_top: false,
           anchor_bottom: false,

           // Code sample configuration
           codesample_languages: [
             { text: 'JSON', value: 'json' },
             { text: 'HTML/XML', value: 'markup' },
             { text: 'JavaScript', value: 'javascript' },
           ],

           // Quickbars configuration for better UX
           quickbars_selection_toolbar:
             'bold italic | quicklink h2 h3 blockquote | forecolor backcolor',
           quickbars_insert_toolbar: 'quickimage quicktable',

           // Apply any custom config overrides
           ...configOverrides,
         }}
        />
      </div>
    );
  }
);

TextEditor.displayName = "TextEditor";
