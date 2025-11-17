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
        <div className='flex  items-center gap-[14px]'>
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

        {/* SECTION 1 */}
        <div>
          {/* <h3 className='text-[#333333] text-[20px] font-inter font-semibold'>1. Privacy</h3> */}
          <p className='text-[#333333] text-[16px] font-inter mt-[26px] text-balance'>
            At Drivest, we value the protection of your personal data. This policy explains what information we 
            collect, why we collect it, and how we protect it.
            <br /><br />
            <strong>Controller</strong><br />
            Drivest<br />
            Email: <a href="mailto:drivestbelgium@gmail.com">drivestbelgium@gmail.com</a>
            <br /><br />
            <strong>Information we collect:</strong><br />
            - Name and contact details (email, phone number)<br />
            - Payment and billing information<br />
            - App usage data (search behavior, preferences)<br /><br />
            <strong>Purpose of collecting data:</strong><br />
            - Create and manage user accounts<br />
            - Process payments and transactions<br />
            - Provide customer support and communication<br />
            - Analyze app usage and improve our services<br /><br />
            <strong>Data sharing:</strong><br />
            We only share personal data when necessary for:<br />
            - Payment processing (via trusted providers such as Stripe or Mollie)<br />
            - Legal obligations
          </p>
        </div>

        {/* SECTION 2 */}
        <div className='mt-8'>
          {/* <h3 className='text-[#333333] text-[20px] font-inter font-semibold'>2. Policy</h3> */}
          <p className='text-[#333333] text-[16px] font-inter mt-[26px] text-balance'>
            <strong>Data Retention:</strong><br />
            We store personal data as long as necessary for the purposes stated or as required by law.<br /><br />
            <strong>Security:</strong><br />
            Drivest takes technical and organizational measures to protect your data from loss, misuse, 
            or unauthorized access.<br /><br />
            <strong>Your Rights:</strong><br />
            You have the right to access, correct, or delete your data. For any request, contact us at:<br />
            <a href="mailto:drivestbelgium@gmail.com">drivestbelgium@gmail.com</a>
          </p>
        </div>

        {/* <div className='flex justify-center'>
          <button className='px-[44px] py-3 bg-[#015093] text-[#FEFEFE] font-poppins rounded hover:opacity-90 transition text-[16px] cursor-pointer mt-[182px]'>
            Save Change
          </button>
        </div> */}

      </div>
    </div>
  )
}

export default Page;
