"use client"
import React, { useEffect, useState } from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader';
import { useParams } from 'next/navigation';
import PdfViewer from '../_components/PdfViewer';
import { useMutation, useQueries, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import TextEditor from '../_components/TextEditor';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

function Workspace() {
    const {user} = useUser();  
    const{fileId} = useParams();
    const fileInfo = useQuery(api.fileStorage.GetFileRecord,{
        fileId: fileId
    })
    const addNotes = useMutation(api.notes.AddNotes)
    const [editorContent, setEditorContent] = useState('')

    const handleSave = async () => {
      if (editorContent) {
        await addNotes({
          fileId,
          notes: editorContent,
          createdBy: 'currentUserId', // Replace with actual user ID
        })
        toast("Your notes have now been saved.")
      }
    }
  
    useEffect(() => {
      console.log(fileInfo)
    }, [fileInfo])
  

  return (
    <div>
      <WorkspaceHeader fileName={fileInfo?.fileName} onSave={handleSave}/>
      <div className='grid grid-cols-2 gap-5'>
        <div>
            {/*text editor*/}
            <TextEditor fileId={fileId} setEditorContent={setEditorContent}/>


        </div>

        <div>
            {/*pdf viewer*/}
            <PdfViewer fileUrl={fileInfo?.fileUrl}/>

        </div>
      </div>
    </div>
  )
}

export default Workspace
