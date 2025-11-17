"use client";
import React from 'react'

import { IoMdArrowBack } from 'react-icons/io'
import { usePathname, useRouter } from 'next/navigation';
import TextToolbar from '@/app/component/TextToolbar';

const Page = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const headerText = pathParts.join(" ");
  const router = useRouter();

  return (
    <div className="w-full p-7 pb-[46px] bg-white overflow-x-auto rounded-[10px]">
      
      <div className='w-full flex items-center justify-between'>
        <div className='flex items-center gap-[14px]'>
          <IoMdArrowBack 
            onClick={() => router.back()}
            className='w-6 h-6 text-[#015093]' 
          />
          <h3 className='text-[#333333] text-[20px] font-inter font-semibold capitalize'>
            {headerText}
          </h3>
        </div>

        {/* <TextToolbar/> */}
      </div>

      <div className='mt-8 pl-1'>

        {/* SECTION 1 – INTRO */}
        <div>
          <h3 className='text-[#333333] text-[20px] font-inter font-semibold'>1. General</h3>
          <p className='text-[#333333] text-[16px] font-inter mt-[26px] text-balance'>
            Drivest aims for customer satisfaction. If you are not satisfied with a purchase or 
            subscription, please contact us at 
            <br />
            <a href="mailto:drivestbelgium@gmail.com" className="text-blue-600 underline">
              drivestbelgium@gmail.com
            </a>.
          </p>
        </div>

        {/* SECTION 2 – DETAILS */}
        <div className='mt-8'>
          <h3 className='text-[#333333] text-[20px] font-inter font-semibold'>2. Digital products and subscriptions</h3>
          <p className='text-[#333333] text-[16px] font-inter mt-[26px] text-balance'>
            - Purchases of digital content or subscriptions are generally non-refundable once access has been granted.
            <br />
            - Exceptions may be made for technical issues or duplicate payments.
          </p>
        </div>

        {/* SECTION 3 – PROCEDURE */}
        <div className='mt-8'>
          <h3 className='text-[#333333] text-[20px] font-inter font-semibold'>3. Procedure</h3>
          <p className='text-[#333333] text-[16px] font-inter mt-[26px] text-balance'>
            To request a refund, send an email within 14 days of purchase including:
            <br /><br />
            - Full name <br />
            - User ID or transaction ID <br />
            - Reason for request
            <br /><br />
            After review, we will respond within 7 working days. If approved,  
            the refund will be processed to your original payment method.
          </p>
        </div>

        {/* <div className='flex justify-center'>
          <button className='px-[44px] py-3 bg-[#015093] text-[#FEFEFE] font-poppins rounded hover:opacity-90 transition text-[16px] cursor-pointer mt-[182px]'>
            Save Change
          </button>
        </div> */}

      </div>

    </div>
  );
}

export default Page;
