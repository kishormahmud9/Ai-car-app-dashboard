"use client";

import React, { useState, useEffect } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";

const API_RESET = "https://admin-dashboard.drivestai.com/reset-password";

export default function SetPassword() {
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [conPass, setConPass] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [resolving, setResolving] = useState(true);

  const router = useRouter();
  const sp = useSearchParams();

 
  useEffect(() => {
    const q =
      (sp?.get("email") || sp?.get("e") || sp?.get("userEmail") || "")
        .trim()
        .toLowerCase();

    if (q) {
      setEmail(q);
      if (typeof window !== "undefined") localStorage.setItem("resetEmail", q);
      setResolving(false);
      return;
    }

    if (typeof window !== "undefined") {
      const saved = (localStorage.getItem("resetEmail") || "")
        .trim()
        .toLowerCase();
      if (saved) {
        setEmail(saved);
        setResolving(false);
        return;
      }
    }

    router.replace("/forgotpassword");
  }, [sp, router]);

  const stopSubmit = (e) => e.preventDefault();

  const handleReset = async () => {
    if (!email) {
      setError("Email not found. Please try again.");
      router.replace("/forgotpassword");
      return;
    }
    if (!newPass.trim()) {
      setError("Please enter your new password");
      return;
    }
    if (!conPass.trim()) {
      setError("Please confirm your password");
      return;
    }
    if (newPass !== conPass) {
      setError("Passwords do not match");
      return;
    }

    try {
      setBusy(true);
      setError("");

      
      const payload = { email, newPassword: newPass };

      const res = await fetch(API_RESET, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
      }

      
      if (typeof window !== "undefined") localStorage.removeItem("resetEmail");
      router.replace("/resetsuccess"); 
    } catch (e) {
      setError(e.message || "Failed to reset password");
    } finally {
      setBusy(false);
    }
  };

  if (resolving) return null;

  return (
    <main className="min-h-screen grid place-items-center bg-[#CCDCE9]">
      <form
        onSubmit={stopSubmit}
        className="bg-white rounded-[25px] pt-[155px] pb-[205px] px-[75px] w-full max-w-[630px] shadow"
      >
        <div className="text-center">
          <h1 className="text-[32px] text-[#333333] font-inter font-medium">
            Reset Password
          </h1>
          <p className="font-inter text-[18px] text-[#333333] mt-6">
            Set your new password to continue
          </p>
          <p className="font-inter text-[14px] text-[#5C5C5C] mt-2">
            For: <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="mt-[68px] mb-[51px]">
          <div>
            <label className="block mb-2 mt-10 font-inter text-[16px]">
              New Password
            </label>
            <div className="relative">
              <input
                className="w-full font-inter text-[16px] text-[#333333] border border-[#015093] outline-none rounded px-3 py-2"
                type={showNewPass ? "text" : "password"}
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              <div
                onClick={() => setShowNewPass(!showNewPass)}
                className="cursor-pointer absolute top-1/2 right-0 -translate-y-1/2"
              >
                {showNewPass ? (
                  <IoEyeOutline className="text-[#015093] w-6 h-6 mr-6" />
                ) : (
                  <FaRegEyeSlash className="text-[#015093] w-6 h-6 mr-6" />
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 mt-10 font-inter text-[16px]">
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="w-full font-inter text-[16px] text-[#333333] border border-[#015093] outline-none rounded px-3 py-2"
                type={showConPass ? "text" : "password"}
                required
                value={conPass}
                onChange={(e) => setConPass(e.target.value)}
              />
              <div
                onClick={() => setShowConPass(!showConPass)}
                className="cursor-pointer absolute top-1/2 right-0 -translate-y-1/2"
              >
                {showConPass ? (
                  <IoEyeOutline className="text-[#015093] w-6 h-6 mr-6" />
                ) : (
                  <FaRegEyeSlash className="text-[#015093] w-6 h-6 mr-6" />
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-[14px] mt-3 font-inter">
                {error}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={busy}
          className="w-full font-poppins text-[16px] bg-[#015093] text-[#FEFEFE] rounded py-3 hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {busy ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </main>
  );
}
