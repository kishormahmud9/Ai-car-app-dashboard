"use client";
import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { MdOutlineCameraAlt } from "react-icons/md";
import Link from "next/link";

// ✅ Import Default Profile Image
import profile from "@/public/profile.png";

const tabs = [
  { href: "/profile", label: "Edit Profile" },
  { href: "/profile/changepass", label: "Change Password" },
];

const Page = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathParts = pathname.split("/").filter(Boolean);

  const [profileData, setProfileData] = useState({
    name: "",
    image: profile, // ✅ default placeholder
    userId: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);

        const res = await fetch("https://admin-dashboard.drivestai.com/admin/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const result = await res.json();
        console.log("Profile API:", result);

        const user = result.data || result.user || result;
        const userId = user._id || user.id || "guest";

        localStorage.setItem("currentUserId", userId);

        const savedImage = localStorage.getItem(`profileImage_${userId}`);

        setProfileData({
          name: user.name || "No name found",
          image: savedImage || user.image || profile,
          userId,
        });
      } catch (error) {
        console.log("Profile Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle Image Change Locally
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !profileData.userId) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImage = reader.result;
      setProfileData((prev) => ({ ...prev, image: newImage }));

      localStorage.setItem(`profileImage_${profileData.userId}`, newImage);

      window.dispatchEvent(new Event("profileImageUpdated"));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full p-7 bg-white overflow-x-auto rounded-[10px]">
      <div className="flex items-center gap-[14px]">
        <IoMdArrowBack
          onClick={() => router.back()}
          className="w-6 h-6 text-[#015093] cursor-pointer"
        />
        <h3 className="text-[#333333] text-[20px] font-inter font-semibold capitalize">
          {pathParts[0] || ""}
        </h3>
      </div>

      <div className="w-[254px] flex flex-col items-center mx-auto">
        {/* ✅ Profile Image */}
        <div className="relative">
          <Image
            src={profileData.image || profile}
            alt="profile"
            width={150}
            height={150}
            className="rounded-full object-cover"
            unoptimized
          />
          <div className="w-[30px] h-[30px] flex items-center justify-center bg-[#FEFEFE] rounded-full absolute bottom-0 right-0">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <MdOutlineCameraAlt
              className="w-6 h-6 rounded-full py-[3.5px] px-[2.5px] bg-[#015093] text-white cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            />
          </div>
        </div>

        {/* ✅ Name Display */}
        <p className="text-[20px] font-medium font-inter text-[#333333] mt-4 mb-6">
          {loading ? "Loading..." : profileData.name}
        </p>

        {/* ✅ Tabs */}
        <div className="flex justify-between gap-[30px]">
          {tabs.map((t) => {
            const isActive = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={
                  isActive
                    ? "pb-[2px] text-[#015093] border-b-2 border-[#015093] font-semibold font-inter text-[16px]"
                    : "pb-[2px] text-[#333333] font-inter text-[16px]"
                }
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
};

export default Page;
