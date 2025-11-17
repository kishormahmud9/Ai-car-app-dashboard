"use client";
import { usePathname } from 'next/navigation';
import React from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { IoSearch } from "react-icons/io5";
import { useRouter } from 'next/navigation';


let Title =({headerText})=>{
  const router = useRouter();
  return(

<div className='flex  items-center gap-[14px]'>
    <IoMdArrowBack onClick={() => router.back()} className='w-6 h-6 text-[#015093]' />
<h3 className='text-[#333333] text-[20px] font-inter font-semibold capitalize' >{headerText}</h3>
</div>

)}
 
const Header = ({}) => {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const headerText = pathParts.join(" ");
  
  return (
    <div className=' flex items-center justify-between'>
    <Title headerText={headerText} />


       <div className='relative'>
         <input type="text" placeholder='Search here...' className='outline-none w-[338px] border border-[#CCDCE9] py-3  pl-[46px] rounded-[10px] placeholder-[#5C5C5C] text-[16px] font-inter text-[#5C5C5C]' />
         <IoSearch className='w-6 h-6 text-[#CCDCE9] absolute top-1/2 left-0 -translate-y-1/2 ml-[14px]' />
       </div>
    </div>
  )
}

export default Header