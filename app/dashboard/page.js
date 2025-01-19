"use client"
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

function Dashboard() {

  const { user } = useUser();

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress
  });

  console.log(fileList);
  
  return (
    <div>
      <h2 className='font-medium text-3xl'>Workspace</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10'>
        {fileList?.length > 0 ? (
          fileList?.map((file, index) => (
            <Link href={'/workspace/' + file.fileId} key={index}>
              <div className='flex p-5 shadow-md rounded-md flex-col items-center justify-center border cursor-pointer hover:scale-105 transition-all'>
                <Image src={'/pdf.png'} alt='file' width={50} height={50} />
                <h2 className='mt-3 font-medium text-lg'>{file?.fileName}</h2>
              </div>
            </Link>
          ))
        ) : (
          <div className='col-span-full text-center py-10'>
            <p className='text-lg font-medium text-gray-600'>
              You haven't uploaded anything yet. <Link href='/dashboard' className='text-indigo-600 hover:underline'>Get started</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard;
