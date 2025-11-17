"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin-dashboard.drivestai.com";
const REGISTER_URL = `${API_BASE}/admin/create-user`; 

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(REGISTER_URL, form, {
        headers: { "Content-Type": "application/json" },
        withCredentials: false, 
      });

     
      if (res.status === 200 || res.status === 201) {
        router.replace("/?registered=1");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-[#CCDCE9]">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[25px] py-[120px] px-[75px] w-full max-w-[630px]"
      >
        <div className="text-center">
          <h1 className="text-[32px] text-[#333333] font-inter font-medium">
            Register an Account
          </h1>
          <p className="font-inter text-[18px] text-[#333333] mt-6">
            Please enter your name, email and password to register
          </p>
        </div>

        <div className="mt-[68px] mb-[51px]">
          <label className="block mb-2 font-inter text-[16px]">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            required
            className="w-full font-inter text-[16px] text-[#333333] border border-[#015093] outline-none rounded px-3 py-2 placeholder-[#5C5C5C]"
          />

          <label className="block mb-2 mt-10 font-inter text-[16px]">
            Email address
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
            className="w-full font-inter text-[16px] text-[#333333] border border-[#015093] outline-none rounded px-3 py-2 placeholder-[#5C5C5C]"
          />

          <label className="block mb-2 mt-10 font-inter text-[16px]">
            Password
          </label>

          <div className="relative">
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPass ? "text" : "password"}
              id="newapass"
              required
              className="w-full font-inter text-[16px] text-[#333333] border border-[#015093] outline-none rounded px-3 py-2"
            />
            <div
              onClick={() => setShowPass((s) => !s)}
              className="cursor-pointer absolute top-1/2 right-0 -translate-y-1/2 mr-3"
            >
              {showPass ? (
                <IoEyeOutline className="text-[#015093] w-6 h-6" />
              ) : (
                <FaRegEyeSlash className="text-[#015093] w-6 h-6" />
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full font-poppins text-[16px] bg-[#015093] text-[#FEFEFE] rounded py-3 hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div>
          <p className="font-inter text-center mt-5">
            Already have an account?{" "}
            <Link
              href="/"
              className="text-[#333333] hover:text-[#015093] font-inter text-[16px] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
