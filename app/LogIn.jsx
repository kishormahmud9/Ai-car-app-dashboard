"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 
import { useSearchParams, useRouter } from "next/navigation";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin-dashboard.drivestai.com";
const LOGIN_URL = `${API_BASE}/login`;


const setAxiosAuthHeader = (token) => {
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axios.defaults.headers.common["Authorization"];
};

export default function LogIn() {
  const [email, setEmail] = useState("drivestbelgium@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("redirect") || "/dashboard";

  
  useEffect(() => {
    const existing = Cookies.get("token");
    if (existing) {
      setAxiosAuthHeader(existing);
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(
        LOGIN_URL,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // ধরে নিচ্ছি API রেসপন্স `{ token: "JWT_STRING", user: {...} }` এমন
      const token = res?.data?.accessToken;
      console.log(token);
      if (!token) throw new Error("Token not found in response.");

      // 1) Cookie set (client-side). HttpOnly লাগলে server route দিয়ে সেট করতে হবে।
      Cookies.set("token", token, {
        expires: 7, // দিন
        path: "/",
        sameSite: "lax",
      });

      // 2) axios default header
      setAxiosAuthHeader(token);

      // 3) চাইলে লোকালস্টোরেজে রাখো (optional)
      localStorage.setItem("token", token);

      router.replace(callbackUrl);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Invalid credentials";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-[#CCDCE9]">
      <form onSubmit={onSubmit} className="bg-white rounded-[25px] py-[120px] px-[75px] w-full max-w-[630px] ">
        <div className="text-center">
          <h1 className="text-[32px] text-[#333333] font-inter font-medium">Login to Account</h1>
          <p className="font-inter text-[18px] text-[#333333] mt-6">Please enter your email and password to continue</p>
        </div>

        <div className="mt-[68px] mb-[51px]">
          <label className="block mb-2 font-inter text-[16px]">Email address</label>
          <input
            className="w-full font-inter text-[16px] text-[#333333] border border-[#015093] outline-none rounded px-3 py-2 placeholder-[#5C5C5C]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />

          <label className="block mb-2 mt-10 font-inter text-[16px]">Password</label>
          <div className="relative">
            <input
              className="w-full font-inter text-[16px] text-[#333333] border border-[#015093] outline-none rounded px-3 py-2 "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? "text" : "password"}
              id="newapass"
              required
            />
            <div onClick={() => setShowPass(!showPass)} className="cursor-pointer absolute top-1/2 right-0 -translate-y-1/2 mr-6">
              {showPass ? (
                <IoEyeOutline className=" text-[#015093] w-6 h-6" />
              ) : (
                <FaRegEyeSlash className=" text-[#015093] w-6 h-6" />
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between mb-10">
          <div className="flex gap-2.5">
            <input type="checkbox" className="ml-2 accent-[#015093]" />
            <p className="text-[#333333] font-inter text-[16px]">Remember Password</p>
          </div>
          <a href="/forgotpassword" className="text-[#333333] hover:text-[#015093] font-inter text-[16px] hover:underline">Forgot Password?</a>
        </div>

        <button
          disabled={loading}
          className="w-full font-poppins text-[16px] bg-[#015093] text-[#FEFEFE] rounded py-3 hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* <p className="font-inter text-center mt-5">
          Not registered?{" "}
          <a href="/register" className="text-[#333333] hover:text-[#015093] font-inter text-[16px] hover:underline">Register</a>
        </p> */}
        
      </form>
    </main>
  );
}
