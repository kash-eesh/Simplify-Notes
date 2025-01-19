import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WorkspaceHeader({fileName, onSave}) {
  return (
    <div className='p-4 flex justify-between shadow-md'>
      <Image src={'/logo.svg'} alt='logo' width='70' height='70'/>
      <h2 className='font-bold'>{fileName}</h2>
      <div className='flex gap-2 items-center'>
        <Button onClick={onSave}>Save</Button>
        <UserButton/>
      </div>
    </div>
  )
}

export default WorkspaceHeader
