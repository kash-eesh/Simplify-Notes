import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import EditorExtensions from './EditorExtensions'
import { useMutation, useQueries, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import WorkspaceHeader from './WorkspaceHeader'

function TextEditor({fileId,setEditorContent }) {

    const notes=useQuery(api.notes.GetNotes,{
        fileId:fileId,
    })


    console.log('notes are: ',notes);

    const editor = useEditor({
        extensions: [StarterKit,
            Placeholder.configure({
                placeholder:"Start taking your notes here..."
            })
        ],
        editorProps:{
            attributes:{
                class:'focus:outline-none h-screen p-5'
            }
        },
        onUpdate: ({ editor }) => {
          // Whenever the editor content changes, we update the state in Workspace component
          setEditorContent(editor.getHTML())
        },
      })

      useEffect(()=>{
        editor&&editor.commands.setContent(notes) 
      },[notes&&editor])

      

  return (
    <div>
       
        <EditorExtensions editor={editor}/>
      <div className='overflow-scroll h-[88vh]'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TextEditor
