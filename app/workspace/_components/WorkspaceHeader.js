import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

function WorkspaceHeader({fileName, onSave}) {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/dashboard');
  }

  return (
    <div className='p-4 flex justify-between shadow-md'>
      <Image 
        src={'/logo.svg'} 
        alt='logo' 
        width='35' 
        height='35'
        onClick={handleLogoClick}
        className='cursor-pointer hover:opacity-80 transition-opacity'
      />
      <h2 className='font-bold'>{fileName}</h2>
      <div className='flex gap-2 items-center'>
        <Button onClick={onSave}>Save</Button>
        <UserButton afterSignOutUrl="/"/>
      </div>
    </div>
  )
}

export default WorkspaceHeader