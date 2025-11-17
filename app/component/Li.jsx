"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Li = ({
  href = "/",
  liText,
  icon,
  className = "",
  children,
  variant = "root", 
  exact = false,      
}) => {
  const pathname = usePathname();

  const match = (to) =>
    exact ? pathname === to : (pathname === to || (to !== "/" && pathname.startsWith(`${to}/`)));

  const isActiveRoot = variant === "root" && match(href);
  const isActiveChild = variant === "child" && match(href);

  const base = "font-inter font-medium transition-all duration-300 cursor-pointer";

  const rootStyle = `
    block w-full pl-[31px] pr-[14px] py-3 rounded-r-[5px] text-[16px]
    hover:text-[#FEFEFE] hover:bg-[#015093]
    ${isActiveRoot ? "bg-[#015093] text-white hover:text-white" : "bg-transparent text-[#0D0F12]"}
  `;

  const childStyle = `
    block w-full flex justify-center pr-[14px] py-3 text-[16px]  hover:text-[#FEFEFE] hover:bg-[#015093]
    ${isActiveChild
      ? "bg-[#015093] text-white hover:text-white"
      : "text-[#0D0F12] "}
  `;

  return (
    <Link
      href={href}
      aria-current={(isActiveRoot || isActiveChild) ? "page" : undefined}
      className={`${base} ${variant === "root" ? rootStyle : childStyle} ${className}`}
    >
      <span className="flex items-center gap-2.5">
        {icon}
        {liText}
      </span>
      {children}
    </Link>
  );
};

export default Li;
