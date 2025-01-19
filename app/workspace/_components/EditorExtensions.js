import { chatSession } from '@/configs/AIModel';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useAction, useMutation } from 'convex/react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Code, Heading1, Heading2, Heading3, Highlighter, Italic, List, Sparkles, Strikethrough, TextQuote, Underline } from 'lucide-react'
import { useParams } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

function EditorExtensions({editor}) {
    const{fileId} = useParams();
    const SearchAI=useAction(api.myAction.search);
    const saveNotes= useMutation(api.notes.AddNotes);
    const {user}=useUser();

    const onAIClick=async()=>{
        toast("AI is getting your answer...")
        const selectedText=editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            " "
  
        );
        console.log(selectedText);

        const result=await SearchAI({
            query:selectedText,
            fileId:fileId
        })

        const UnformattedAns=JSON.parse(result);
        let AllUnformattedAns = '';
        UnformattedAns&&UnformattedAns.forEach(item=>{
            AllUnformattedAns= AllUnformattedAns+item.pageContent
        });

        const PROMPT="For question :"+selectedText+" and with the given content with answer,"+
        " please give appropriate answer in HTML format. The answer content is: "+AllUnformattedAns;

        const AIModelResult = await chatSession.sendMessage(PROMPT);
        console.log(AIModelResult.response.text());
        const FinalAns=AIModelResult.response.text().replace('```','').replace('html','').replace('```',''); 

        const AllText=editor.getHTML();
        editor.commands.setContent(AllText+'<p><strong>Answer: </strong>'+FinalAns+'</p>');


        saveNotes({
          notes:editor.getHTML(),
          fileId:fileId,
          createdBy:user?.primaryEmailAddress?.emailAddress
        })

    }

  return editor&&(
    <div className='p-5'>
      <div className="control-group">
        <div className="button-group flex gap-3">
        <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'text-blue-500' : ''}
          >
            <Heading1/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'text-blue-500' : ''}
          >
            <Heading2/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'text-blue-500' : ''}
          >
            <Heading3/>
          </button>  
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'text-blue-500' : ''}
          >
            <Bold/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'text-blue-500' : ''}
          >
            <Italic/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'text-blue-500' : ''}
          >
            <Underline/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'text-blue-500' : ''}
          >
            <Code/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'text-blue-500' : ''}
          >
            <List/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'text-blue-500' : ''}
          >
            <TextQuote/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'text-blue-500' : ''}
          >
            <Highlighter/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'text-blue-500' : ''}
          >
            <Strikethrough/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'text-blue-500' : ''}
          >
            <AlignLeft/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'text-blue-500' : ''}
          >
            <AlignCenter/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'text-blue-500' : ''}
          >
            <AlignRight/>
          </button>
          <button
            onClick={() => onAIClick()}
            className={'hover:text-blue-500'}
          >
            <Sparkles/>
          </button>
        </div>
    </div>
    </div>
  )
}

export default EditorExtensions
