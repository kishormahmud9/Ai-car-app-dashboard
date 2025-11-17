"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import Link from "next/link";
import { useNotifications } from "../SimpleProvider";
import userPlaceholder from "@/public/profile.png";

const Topbar = () => {
  const { unreadCount } = useNotifications();

  const [userData, setUserData] = useState({
    name: "Loading...",
    image: userPlaceholder,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("currentUserId");

    // ✅ Load saved profile image (if exists)
    if (userId) {
      const savedImg = localStorage.getItem(`profileImage_${userId}`);
      if (savedImg) {
        setUserData((prev) => ({ ...prev, image: savedImg }));
      }
    }

    // ✅ Fetch profile data
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const res = await fetch("https://admin-dashboard.drivestai.com/admin/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Topbar Profile Response:", data);

        // ✅ Extract name safely (supports all backend structures)
        const userName =
          data?.data?.admin?.name ||
          data?.data?.name ||
          data?.admin?.name ||
          data?.user?.name ||
          data?.name ||
          "User";

        setUserData((prev) => ({
          ...prev,
          name: userName,
        }));
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };

    fetchProfile();

    // ✅ Live image update listener
    const updateImage = () => {
      if (!userId) return;
      const stored = localStorage.getItem(`profileImage_${userId}`);
      setUserData((prev) => ({ ...prev, image: stored || userPlaceholder }));
    };

    window.addEventListener("profileImageUpdated", updateImage);
    return () => window.removeEventListener("profileImageUpdated", updateImage);
  }, []);

  return (
    <div className="min-w-0 w-[calc(100vw-252px)] py-7 flex justify-end pr-[50px]">
      <div className="w-[248px] flex gap-8">
        {/* 🔔 Notification */}
        <Link href="/notifications" className="relative">
          <IoMdNotificationsOutline className="w-[42px] h-[42px] p-[9px] text-[#015093] bg-[#CCDCE9] rounded-full" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-2 py-[1px]">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* 👤 Profile */}
        <Link href="/profile" className="flex items-center gap-3">
          <Image
            src={userData.image || userPlaceholder}
            alt="user"
            width={42}
            height={42}
            className="rounded-full object-cover"
            unoptimized
          />
          <p className="font-inter font-medium text-[#333333] text-[16px]">
            {userData.name}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
