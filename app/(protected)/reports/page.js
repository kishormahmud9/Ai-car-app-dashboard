"use client";
import React, { useMemo, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Header from "@/app/component/Header";
import { MdOutlineEdit } from "react-icons/md";
import Image from "next/image";


const baseRows = [
  { sl: "#1231", name: "Annette Black",  avatar: "user1.png",  date: "10/28/12", status: "resolved", car:"Toyota Corolla" },
  { sl: "#1232", name: "Jerome Bell",    avatar: "user2.png",  date: "01/05/12", status: "resolved", car:"Honda Civic" },
  { sl: "#1233", name: "Ronald Richards",avatar: "user3.png",  date: "08/02/19", status: "pending",  car:"Ford F-150" },
  { sl: "#1234", name: "Dianne Russell", avatar: "user4.png",  date: "08/03/14", status: "pending",  car:"Toyota Corolla" },
  { sl: "#1235", name: "Albert Flores",  avatar: "user5.png",  date: "02/11/12", status: "resolved", car:"Honda Civic" },
  { sl: "#1236", name: "Eleanor Pena",   avatar: "user6.png",  date: "10/06/13", status: "pending",  car:"BMW ix3" },
  { sl: "#1237", name: "Floyd Miles",    avatar: "user7.png",  date: "05/03/14", status: "resolved", car:"Toyota Corolla" },
  { sl: "#1238", name: "Cody Fisher",    avatar: "user8.png",  date: "07/18/17", status: "pending",  car:"Honda Civic" },
  { sl: "#1239", name: "Ralph Edwards",  avatar: "user9.png",  date: "04/04/18", status: "pending",  car:"BMW ix3" },
  { sl: "#1240", name: "Devon Lane",     avatar: "user10.png", date: "08/21/15", status: "resolved", car:"Ford F-150" },
    { sl: "#1236", name: "Eleanor Pena",   avatar: "user6.png",  date: "10/06/13", status: "pending",  car:"BMW ix3" },
  { sl: "#1237", name: "Floyd Miles",    avatar: "user7.png",  date: "05/03/14", status: "resolved", car:"Toyota Corolla" },
  { sl: "#1238", name: "Cody Fisher",    avatar: "user8.png",  date: "07/18/17", status: "pending",  car:"Honda Civic" },
  { sl: "#1239", name: "Ralph Edwards",  avatar: "user9.png",  date: "04/04/18", status: "pending",  car:"BMW ix3" },
  { sl: "#1240", name: "Devon Lane",     avatar: "user10.png", date: "08/21/15", status: "resolved", car:"Ford F-150" },
];


const PAGE_SIZE = 10;

function Badge({ children, color }) {
  const palette = {
    red: "text-[#DC2626] ring-1 ring-[#DC2626]/20",
    blue: "text-[#49A0E6] ring-1 ring-[#49A0E6]/20",
    yellow: "text-[#FFC42D] ring-1 ring-[#FFC42D]/20",
  };
  const cls = palette[color] || palette.yellow;
  return (
    <span className={`inline-flex items-center rounded-full px-6 py-[9px] text-[16px] font-inter ${cls}`}>
      {children}
    </span>
  );
}

function StatusCell({ status }) {
  if (status === "pending") return <Badge color="red">Pending</Badge>;
  if (status === "resolved") return <Badge color="blue">Resolved</Badge>;
  return <Badge color="yellow">{status}</Badge>;
}

function Person({ name, avatar }) {
  const src = avatar.startsWith("/") ? avatar : `/${avatar}`;
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-9 w-9">
        <Image
          src={src}
          alt={name}
          fill
          sizes="36px"
          className="rounded-full object-cover ring-2 ring-white shadow"
        />
      </div>
      <span className="text-[#333333] font-inter text-[16px]">{name}</span>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" stroke="white" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" />
    </svg>
  );
}

export default function AgentApprovalTable() {
  const [page, setPage] = useState(1);

  const totalItems = baseRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;

  
  const currentRows = useMemo(() => {
    return baseRows.slice(startIdx, startIdx + PAGE_SIZE);
  }, [startIdx]);

 
  const pageList = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const out = [];
    const left = Math.max(2, page - 2);
    const right = Math.min(totalPages - 1, page + 2);
    out.push(1);
    if (left > 2) out.push("…");
    for (let i = left; i <= right; i++) out.push(i);
    if (right < totalPages - 1) out.push("…");
    out.push(totalPages);
    return out;
  }, [page, totalPages]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="w-full p-7 bg-white overflow-x-auto rounded-[10px]">
      <Header />

      <table className="min-w-[720px] w-full text-left table-fixed mt-[18px]">
        <thead>
          <tr className="bg-white text-[18px] font-inter font-semibold text-[#333333]">
            <th className="py-3 pr-4 w-[160px]">Report ID</th>
            <th className="py-3 pr-4">Report Date</th>
            <th className="py-3 pr-4">Car Name</th>
            <th className="py-3 pr-4">Reported By</th>
            <th className="py-3 pr-4">Agent Name</th>
            <th className="py-3 pr-2">Status</th>
            <th className="py-3 pr-4">Action</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {currentRows.map((r) => (
            <tr key={r.sl} className="align-middle">
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px] whitespace-nowrap">
                {r.sl}
              </td>
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">{r.date}</td>
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">{r.car}</td>

             
              <td className="py-4 pr-4">
                <Person name={r.name} avatar={r.avatar} />
              </td>

             
              <td className="py-4 pr-4">
                <Person name={r.name} avatar={r.avatar} />
              </td>

              <td className="py-4 pr-4">
                <StatusCell status={r.status} />
              </td>

              <td className="py-4 pr-2">
                <div className="flex gap-3">
                  <button
                    type="button"
                    aria-label={`View details of ${r.sl}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#FFC42D] hover:opacity-90 transition"
                  >
                    <EyeIcon />
                  </button>
                  <button
                    type="button"
                    aria-label={`Edit ${r.sl}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#015093] hover:opacity-90 transition"
                  >
                    <MdOutlineEdit className="text-white rotate-[270deg] w-6 h-6" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      <div className="mt-6 flex justify-center">
        <nav className="inline-flex items-center gap-4" aria-label="Pagination">
          <button
            onClick={goPrev}
            disabled={page === 1}
            className="text-[#333333] flex items-center gap-4 font-inter text-[16px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IoIosArrowBack />
            Previous
          </button>

          {pageList.map((p, i) =>
            p === "…" ? (
              <span key={`dots-${i}`} className="px-2 text-slate-500">…</span>
            ) : (
              <button
                key={`page-${p}`}
                onClick={() => setPage(Number(p))}
                className={`w-[30px] h-[30px] rounded-full font-inter text-[16px] flex items-center justify-center ${
                  p === page ? "bg-[#015093] text-white" : "text-[#333333] hover:bg-slate-50"
                }`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={goNext}
            disabled={page === totalPages}
            className="text-[#333333] flex items-center gap-4 font-inter text-[16px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <IoIosArrowForward />
          </button>
        </nav>
      </div>
    </div>
  );
}
