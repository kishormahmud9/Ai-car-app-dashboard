"use client";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Header from "@/app/component/Header";
import Image from "next/image";
import Cookies from "js-cookie";

const API_BASE = "https://admin-dashboard.drivestai.com";
const CARS_URL = `${API_BASE}/admin/cars?initial=true`;
const PAGE_SIZE = 10;

// function Badge({ children, color }) {
//   const cls =
//     color === "blue"
//       ? "text-[#49A0E6] bg-[#49A0E6]/10 ring-1 ring-[#49A0E6]/20"
//       : "text-[#DC4600] bg-[#DC4600]/10 ring-1 ring-[#DC4600]/20";
//   return (
//     <span className={`inline-flex items-center rounded-[5px] px-6 py-[9px] text-[16px] font-inter ${cls}`}>
//       {children}
//     </span>
//   );
// }

// function OutlineBtn({ children, tone = "slate", onClick }) {
//   const tones = {
//     blue:  "text-[#49A0E6] ring-1 ring-inset ring-[#49A0E6]/20 hover:bg-[#49A0E6]/10",
//     red:   "text-[#DC4600] ring-1 ring-inset ring-[#DC4600]/20 hover:bg-[#DC4600]/10",
//     slate: "text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-50",
//   };
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`inline-flex items-center rounded-md px-6 py-[9px] text-[16px] font-inter cursor-pointer ${tones[tone]} transition`}
//     >
//       {children}
//     </button>
//   );
// }

// function ActionCell({ status }) {
//   const s = String(status || "pending").toLowerCase();
//   if (s === "approved") return <Badge color="blue">Approved</Badge>;
//   if (s === "rejected") return <Badge color="red">Rejected</Badge>;
//   return (
//     <div className="flex items-center gap-3 text-[16px] font-inter">
//       <OutlineBtn tone="blue">Approve</OutlineBtn>
//       <OutlineBtn tone="red">Reject</OutlineBtn>
//     </div>
//   );
// }

function Person({ name, avatar }) {
  const isLocal = typeof avatar === "string" && avatar.startsWith("/");
  const src = isLocal ? avatar : avatar || "/user1.png";
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-9 w-9">
        <Image
          src={src}
          alt={name || "Agent"}
          fill
          sizes="36px"
          className="rounded-full object-cover ring-2 ring-white shadow"
          unoptimized={!isLocal}
        />
      </div>
      <span className="text-[#333333] font-inter text-[16px]">
        {name || "Unknown"}
      </span>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" />
    </svg>
  );
}

const fmtDate = (d) => {
  if (!d) return "";
  const t = new Date(d);
  if (isNaN(t)) return String(d);
  const mm = String(t.getMonth() + 1).padStart(2, "0");
  const dd = String(t.getDate()).padStart(2, "0");
  const yy = String(t.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
};

const normalizeLocation = (loc) => {
  if (!loc) return "Location";
  if (typeof loc === "string") return loc;
  if (Array.isArray(loc)) return loc.filter(Boolean).join(", ");
  if (typeof loc === "object") {
    const city = loc.city || loc.town || loc.area || loc.name;
    const country = loc.country;
    const out = [city, country].filter(Boolean).join(", ");
    return out || "Location";
  }
  return "Location";
};

/* ================== Component ================== */
export default function AgentApprovalTable() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        // token (optional)
        let token = Cookies.get("token") || localStorage.getItem("token") || "";
        if (token && token.startsWith('"') && token.endsWith('"')) {
          try {
            token = JSON.parse(token);
          } catch {}
        }
        if (token.startsWith("Bearer ")) token = token.slice(7);

        const res = await fetch(CARS_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          let msg;
          try {
            msg = JSON.parse(text)?.message || JSON.parse(text)?.error;
          } catch {}
          throw new Error(msg || text || `HTTP ${res.status}`);
        }

        const body = await res.json();
        console.log("body", body);
        const list = Array.isArray(body)
          ? body
          : body?.cars || body?.data || body?.items || [];

        const mapped = list.map((c, i) => ({
          id: c._id ?? c.id ?? `${i}`,
          sl: c.sl || `#${String(c._id || c.id || i).slice(-4)}`,
          car: c.carName || c.name || c.model || c.title || "Unknown Car",
          location: normalizeLocation(c.location),
          price:
            typeof c.price === "number"
              ? `$${c.price.toLocaleString()}`
              : c.price || "$0",
          margin:
            typeof c.margin === "number"
              ? `$${c.margin.toLocaleString()}`
              : c.margin || "$0",
          name:
            c.agentName ||
            c.agent?.name ||
            c.ownerName ||
            c.sellerName ||
            "Unknown",
          avatar:
            c.agentAvatar ||
            c.agent?.avatar ||
            c.ownerAvatar ||
            c.sellerAvatar ||
            "/user1.png",
          date: fmtDate(c.createdAt || c.dateAdded || c.created_on),
          status: String(c.status || "pending").toLowerCase(),
        }));

        if (!off) setRows(mapped);
      } catch (e) {
        if (!off) setErr(e.message || "Failed to load cars");
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => {
      off = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  const pageList = useMemo(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const out = [1];
    const left = Math.max(2, page - 2);
    const right = Math.min(totalPages - 1, page + 2);
    if (left > 2) out.push("…");
    for (let i = left; i <= right; i++) out.push(i);
    if (right < totalPages - 1) out.push("…");
    out.push(totalPages);
    return out;
  }, [page, totalPages]);

  return (
    <div className="w-full p-7 bg-white overflow-x-auto rounded-[10px]">
      <Header />

      <div className="mt-2 mb-2">
        {loading && <p className="text-sm text-gray-500">Loading…</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>

      <table className="min-w-[920px] w-full text-left table-fixed mt-[18px]">
        <thead>
          <tr className="bg-white text-[18px] font-inter font-semibold text-[#333333]">
            <th className="py-3 pr-4 w-[10%]">SL No</th>
            <th className="py-3 pr-2 w-[15%]">Car Name</th>
            <th className="py-3 pr-2 w-[15%]">Location</th>
            <th className="py-3 pr-2 w-[10%]">Price</th>
            {/* <th className="py-3 pr-4 w-[5%]">Margin</th> */}
            {/* <th className="py-3 pr-4 w-[10%]">Agent Name</th> */}
            <th className="py-3 pr-2 w-[10%]">Date Added</th>
            <th className="py-3 pr-4 w-[10%]">Details</th>
            {/* <th className="py-3 pr-2 w-[10%] text-center ">Action</th> */}
          </tr>
        </thead>

        <tbody className="bg-white">
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={9} className="py-6 text-center text-gray-500">
                No cars found
              </td>
            </tr>
          )}

          {currentRows.map((r) => (
            <tr key={r.id || r.sl} className="align-middle">
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px] whitespace-nowrap">
                {r.sl}
              </td>
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">
                {r.car}
              </td>
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">
                {r.location}
              </td>
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">
                {r.price}
              </td>
              {/* <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">{r.margin}</td> */}
              {/* <td className="py-4 pr-4"><Person name={r.name} avatar={r.avatar} /></td> */}
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">
                {r.date}
              </td>
              <td className="py-4 pr-2">
                <button
                  type="button"
                  aria-label={`View details of ${r.sl}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#015093] hover:opacity-90 transition"
                >
                  <EyeIcon />
                </button>
              </td>
              {/* <td className="py-4 pr-4"><ActionCell status={r.status} /></td> */}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-center">
        <nav className="inline-flex items-center gap-4" aria-label="Pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-[#333333] flex items-center gap-4 font-inter text-[16px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IoIosArrowBack /> Previous
          </button>

          {pageList.map((p, i) =>
            p === "…" ? (
              <span key={`dots-${i}`} className="px-2 text-slate-500">
                …
              </span>
            ) : (
              <button
                key={`page-${p}`}
                onClick={() => setPage(Number(p))}
                className={`w-[30px] h-[30px] rounded-full font-inter text-[16px] flex items-center justify-center ${
                  p === page
                    ? "bg-[#015093] text-white"
                    : "text-[#333333] hover:bg-slate-50"
                }`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-[#333333] flex items-center gap-4 font-inter text-[16px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <IoIosArrowForward />
          </button>
        </nav>
      </div>
    </div>
  );
}
