"use client";
import React from 'react'

import { IoMdArrowBack } from 'react-icons/io'
import { usePathname, useRouter } from 'next/navigation';
import TextToolbar from '@/app/component/TextToolbar';

const Page = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const headerText = pathParts.join(" & ");
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

      <div className="mt-8 pl-1">

        {/* SECTION 1 — TERMS */}
        <div>
          {/* <h3 className="text-[#333333] text-[20px] font-inter font-semibold">1. Terms</h3> */}
          <p className="text-[#333333] text-[16px] font-inter mt-[26px] text-balance">
            These terms and conditions apply to the use of the Drivest app and all related services.
            <br /><br />
            <strong>1. Definitions</strong><br />
            - <strong>Drivest:</strong> provider of the app and related services.<br />
            - <strong>User:</strong> any person using the app or making a purchase.
            <br /><br />
            <strong>2. Acceptance</strong><br />
            By using the app, you agree to these terms and conditions.
            <br /><br />
            <strong>3. Services</strong><br />
            Drivest provides data, analytics, and information tools related to vehicle trading opportunities. 
            Information is provided for support purposes and should not be considered financial advice.
          </p>
        </div>

        {/* SECTION 2 — CONDITIONS */}
        <div className="mt-8">
          {/* <h3 className="text-[#333333] text-[20px] font-inter font-semibold">2. Conditions</h3> */}
          <p className="text-[#333333] text-[16px] font-inter mt-[26px] text-balance">
            <strong>4. Payments</strong><br />
            All payments within the app are processed securely through our payment partners. 
            Prices include VAT unless otherwise stated. By completing a payment, you also agree to 
            the payment provider’s conditions.
            <br /><br />
            <strong>5. Liability</strong><br />
            Drivest shall not be liable for any damages resulting from the use of the app or the information provided. 
            Users remain fully responsible for their buying and selling decisions.
            <br /><br />
            <strong>6. Intellectual Property</strong><br />
            All app content, logos, and data remain the intellectual property of Drivest. 
            Copying or reproducing without written consent is prohibited.
            <br /><br />
            <strong>7. Governing Law</strong><br />
            These terms are governed by Belgian law. Disputes shall be settled in the courts of Antwerp, Belgium.
          </p>
        </div>

        {/* <div className="flex justify-center">
          <button className="px-[44px] py-3 bg-[#015093] text-[#FEFEFE] font-poppins rounded hover:opacity-90 transition text-[16px] cursor-pointer mt-[182px]">
            Save Change
          </button>
        </div> */}

      </div>

    </div>
  );
};

export default Page;
