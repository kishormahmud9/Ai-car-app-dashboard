"use client";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

const Page = () => {
  const [showPass, setShowPass] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setMessage({ text: "", type: "" });

    if (!newPassword) {
      return setMessage({
        text: "Please enter a new password.",
        type: "error",
      });
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return setMessage({
        text: "Unauthorized! Please log in again.",
        type: "error",
      });
    }

    setLoading(true);
    try {
      const payload = { newpass: newPassword }; // ✅ backend expects this key

      console.log("Sending payload:", payload);

      const res = await fetch(
        "https://admin-dashboard.drivestai.com/admin/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword: newPassword }),
        }
      );

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      console.log("Response:", res.status, data);

      if (res.ok) {
        setMessage({
          text: data.message || "Password changed successfully!",
          type: "success",
        });
        setNewPassword("");
      } else {
        setMessage({
          text:
            data.message ||
            (res.status === 404
              ? "Endpoint not found. Try /api/admin/change-password"
              : "Failed to change password."),
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setMessage({
        text: "Something went wrong. Try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[481px] flex flex-col items-center mx-auto mt-[26px]">
      <p className="text-[24px] text-[#333333] font-inter mb-4">
        Change Password
      </p>

      <div className="w-full">
        <div className="mt-4">
          <label
            className="text-[#333333] text-[16px] font-inter"
            htmlFor="newpass"
          >
            New Password
          </label>
          <div className="relative mt-2">
            <input
              className="w-full border border-[#015093] rounded-[5px] py-[13px] px-4 outline-none text-[16px] text-[#5C5C5C]"
              type={showPass ? "text" : "password"}
              id="newpass"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div
              onClick={() => setShowPass(!showPass)}
              className="cursor-pointer"
            >
              {showPass ? (
                <IoEyeOutline className="w-6 h-6 absolute top-1/2 right-0 -translate-y-1/2 mr-6" />
              ) : (
                <FaRegEyeSlash className="w-6 h-6 absolute top-1/2 right-0 -translate-y-1/2 mr-6" />
              )}
            </div>
          </div>
        </div>

        {message.text && (
          <p
            className={`mt-4 text-center ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className={`px-[44px] py-3 mt-6 rounded font-poppins text-[16px] text-white transition ${
              loading
                ? "bg-[#94A3B8] cursor-not-allowed"
                : "bg-[#015093] hover:opacity-90 cursor-pointer"
            }`}
          >
            {loading ? "Changing..." : "Save Change"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
