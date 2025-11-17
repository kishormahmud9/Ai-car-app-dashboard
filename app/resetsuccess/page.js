"use client";
import Link from "next/link";

export default function ResetSuccessPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-[#CCDCE9]">
      <div className="bg-white rounded-[25px] py-[160px] px-[75px] w-full max-w-[630px]  text-center">
        <h1 className="text-[32px] text-[#333333] font-inter font-medium">
          Password Reset Successful
        </h1>
        <p className="font-inter text-[18px] text-[#333333] mt-6">
          Your password has been updated. You can now log in to your account.
        </p>

        <Link href="/" className="inline-block w-full mt-[60px]">
          <button className="w-full font-poppins text-[16px] bg-[#015093] text-[#FEFEFE] rounded py-3 hover:opacity-90 cursor-pointer">
            Go to Login
          </button> 
        </Link>
      </div>
    </main>
  );
}
