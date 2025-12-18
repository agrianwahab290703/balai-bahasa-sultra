import React, { useCallback, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Unlink,
  Upload,
  X,
  ChevronDown,
  ALargeSmall,
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

/**
 * RichTextEditor component props
 * @see Requirements 12.1, 12.2
 */
export interface RichTextEditorProps {
  /** Current HTML content value */
  value: string;
  /** Callback when content changes */
  onChange: (value: string) => void;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Minimum height of the editor in pixels */
  minHeight?: number;
  /** Callback for image upload - returns the URL of the uploaded image */
  onImageUpload?: (file: File) => Promise<string>;
  /** Whether to show the media library button */
  mediaLibraryEnabled?: boolean;
  /** Callback when media library button is clicked */
  onMediaLibraryOpen?: () => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Error message to display */
  error?: string;
}

/**
 * Toolbar button component
 */
interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'h-8 w-8 p-0 bg-white/80 backdrop-blur-sm border border-gray-200',
      'hover:bg-blue-50 hover:border-blue-300 hover:scale-102',
      'text-gray-600 hover:text-blue-600',
      'transition-all duration-200',
      isActive && 'bg-blue-100 text-blue-700 border-blue-300',
      disabled && 'opacity-50 cursor-not-allowed'
    )}
  >
    {children}
  </Button>
);

/**
 * Toolbar separator component
 */
const ToolbarSeparator: React.FC = () => (
  <div className="w-px h-6 bg-gray-200 mx-1" />
);

/**
 * Editor toolbar component
 */
interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload?: (file: File) => Promise<string>;
  onMediaLibraryOpen?: () => void;
  mediaLibraryEnabled?: boolean;
  disabled?: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onImageUpload,
  onMediaLibraryOpen,
  mediaLibraryEnabled = false,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onImageUpload || !editor) return;

    try {
      const url = await onImageUpload(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Failed to upload image:', error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [editor, onImageUpload]);

  const addLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  // Function to create ordered list with specific class for styling
  const createOrderedListWithType = useCallback((listClass: string) => {
    if (!editor) return;
    
    // Toggle ordered list and update attributes
    if (editor.isActive('orderedList')) {
      // Update existing list's class
      editor.chain().focus().updateAttributes('orderedList', { 
        class: listClass 
      }).run();
    } else {
      // Create new list with class
      editor.chain().focus().toggleOrderedList().updateAttributes('orderedList', {
        class: listClass
      }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-3 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        disabled={disabled}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        disabled={disabled}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        disabled={disabled}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        disabled={disabled}
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        disabled={disabled}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        disabled={disabled}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        disabled={disabled}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        disabled={disabled}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      
      {/* Basic Numbered List */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        disabled={disabled}
        title="Numbered List (1, 2, 3)"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      {/* List Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            title="List Type Options"
            className={cn(
              'h-8 px-2 bg-white/80 backdrop-blur-sm border border-gray-200',
              'hover:bg-blue-50 hover:border-blue-300',
              'text-gray-600 hover:text-blue-600',
              'transition-all duration-200',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ALargeSmall className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px]">
          <DropdownMenuItem onClick={() => createOrderedListWithType('list-decimal')}>
            <span className="flex items-center gap-3">
              <span className="w-8 text-gray-500 font-mono">1.</span>
              <span>Angka (1, 2, 3)</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => createOrderedListWithType('list-alpha-lower')}>
            <span className="flex items-center gap-3">
              <span className="w-8 text-gray-500 font-mono">a.</span>
              <span>Huruf kecil (a, b, c)</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => createOrderedListWithType('list-alpha-upper')}>
            <span className="flex items-center gap-3">
              <span className="w-8 text-gray-500 font-mono">A.</span>
              <span>Huruf besar (A, B, C)</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => createOrderedListWithType('list-roman-lower')}>
            <span className="flex items-center gap-3">
              <span className="w-8 text-gray-500 font-mono">i.</span>
              <span>Romawi kecil (i, ii, iii)</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => createOrderedListWithType('list-roman-upper')}>
            <span className="flex items-center gap-3">
              <span className="w-8 text-gray-500 font-mono">I.</span>
              <span>Romawi besar (I, II, III)</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        disabled={disabled}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Text alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        disabled={disabled}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        disabled={disabled}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        disabled={disabled}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        disabled={disabled}
        title="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Links */}
      <ToolbarButton
        onClick={addLink}
        isActive={editor.isActive('link')}
        disabled={disabled}
        title="Add Link"
      >
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>
      {editor.isActive('link') && (
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={disabled}
          title="Remove Link"
        >
          <Unlink className="h-4 w-4" />
        </ToolbarButton>
      )}

      <ToolbarSeparator />

      {/* Image upload */}
      {onImageUpload && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageUpload}
            className="hidden"
          />
          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            title="Upload Image"
          >
            <Upload className="h-4 w-4" />
          </ToolbarButton>
        </>
      )}

      {/* Media library */}
      {mediaLibraryEnabled && onMediaLibraryOpen && (
        <ToolbarButton
          onClick={onMediaLibraryOpen}
          disabled={disabled}
          title="Open Media Library"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
      )}

      <ToolbarSeparator />

      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={disabled || !editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={disabled || !editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
};

// Custom OrderedList extension with class attribute support
const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'list-decimal',
        parseHTML: element => element.getAttribute('class') || 'list-decimal',
        renderHTML: attributes => {
          return {
            class: attributes.class,
          };
        },
      },
    };
  },
});

/**
 * Rich Text Editor component using TipTap
 * Provides formatting options (bold, italic, headings, lists, links)
 * and image insertion capability.
 * 
 * @see Requirements 12.1, 12.2
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write something...',
  minHeight = 200,
  onImageUpload,
  mediaLibraryEnabled = false,
  onMediaLibraryOpen,
  disabled = false,
  className,
  error,
}) => {
  // Memoize extensions to prevent unnecessary re-renders
  const extensions = React.useMemo(() => [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      bulletList: {
        HTMLAttributes: {
          class: 'list-disc pl-6 space-y-1',
        },
      },
      orderedList: false, // Disable default, use custom
      listItem: {
        HTMLAttributes: {
          class: 'pl-1',
        },
      },
      paragraph: {
        HTMLAttributes: {
          class: 'mb-3',
        },
      },
    }),
    CustomOrderedList.configure({
      HTMLAttributes: {
        class: 'list-decimal pl-6 space-y-1',
      },
    }),
    Underline,
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg',
      },
      allowBase64: false,
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline hover:text-primary/80',
      },
    }),
    Placeholder.configure({
      placeholder: placeholder || 'Write something...',
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ], [placeholder]);

  const editor = useEditor({
    extensions,
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== value) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose max-w-none focus:outline-none p-4',
          'prose-headings:font-semibold prose-headings:text-foreground',
          'prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-3',
          'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
          'prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground',
          'prose-ul:list-disc prose-ul:pl-6 prose-ul:my-3',
          'prose-ol:pl-6 prose-ol:my-3',
          'prose-li:my-1 prose-li:leading-relaxed',
          'prose-img:rounded-lg prose-img:max-w-full'
        ),
      },
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  });

  // Only update disabled state, content is handled by useEditor
  React.useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  /**
   * Insert an image from the media library
   */
  const insertImage = useCallback((url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className={cn('rich-text-editor', className)}>
      <div
        className={cn(
          'border-2 border-gray-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm',
          error && 'border-red-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <EditorToolbar
          editor={editor}
          onImageUpload={onImageUpload}
          onMediaLibraryOpen={onMediaLibraryOpen}
          mediaLibraryEnabled={mediaLibraryEnabled}
          disabled={disabled}
        />
        <EditorContent
          editor={editor}
          className={cn(
            'bg-white/60',
            `min-h-[${minHeight}px]`,
            disabled && 'pointer-events-none'
          )}
        />
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
            <X className="h-3 w-3 text-white" />
          </div>
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Hook to get the editor instance for external control
 * Useful when you need to insert images from a media picker modal
 */
export const useRichTextEditor = () => {
  const editorRef = useRef<Editor | null>(null);

  const insertImage = useCallback((url: string) => {
    if (editorRef.current) {
      editorRef.current.chain().focus().setImage({ src: url }).run();
    }
  }, []);

  const insertLink = useCallback((url: string, text?: string) => {
    if (editorRef.current) {
      if (text) {
        editorRef.current
          .chain()
          .focus()
          .insertContent(`<a href="${url}">${text}</a>`)
          .run();
      } else {
        editorRef.current
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url })
          .run();
      }
    }
  }, []);

  return {
    editorRef,
    insertImage,
    insertLink,
  };
};

export default RichTextEditor;
