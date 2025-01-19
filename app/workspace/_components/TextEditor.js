'use client';

import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import EditorExtensions from './EditorExtensions'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import WorkspaceHeader from './WorkspaceHeader'

function TextEditor({ fileId, setEditorContent }) {
  // Add mounting state
  const [isMounted, setIsMounted] = useState(false);

  const notes = useQuery(api.notes.GetNotes, {
    fileId: fileId,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start taking your notes here..."
      })
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none h-screen p-5'
      }
    },
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML())
    },
    // Add this line to fix hydration
    immediatelyRender: false,
  });

  // Handle mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle content updates
  useEffect(() => {
    if (editor && notes) {
      editor.commands.setContent(notes);
    }
  }, [notes, editor]);

  // Don't render until mounted
  if (!isMounted) {
    return null; // Or a loading spinner/placeholder
  }

  return (
    <div>
      <EditorExtensions editor={editor} />
      <div className='overflow-scroll h-[88vh]'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// Export with dynamic import in parent component
export default TextEditor;