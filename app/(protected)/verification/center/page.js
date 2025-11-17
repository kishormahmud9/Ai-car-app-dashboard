"use client";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Image from "next/image";
import Header from "@/app/component/Header";
import Cookies from "js-cookie";

const API_BASE = "https://admin-dashboard.drivestai.com";
const LIST_URL = `${API_BASE}/admin/user-list`;
const PAGE_SIZE = 10;

// ✅ approve -> active, reject -> inactive
const TARGET_STATUS = {
  approve: "active",
  reject: "inactive",
};

function Badge({ children, tone }) {
  const color =
    tone === "active"
      ? "text-[#0DBF69] bg-[#0DBF69]/10 ring-1 ring-[#0DBF69]/20 w-full  flex items-center justify-center"
      : tone === "inactive"
      ? "text-[#DC4600] bg-[#DC4600]/10 ring-1 ring-[#DC4600]/20 w-full  flex items-center justify-center"
      : "text-slate-600 bg-slate-100 ring-1 ring-slate-200";
  return (
    <span className={`inline-flex items-center rounded-[5px] px-6 py-[9px] text-[16px] font-inter ${color}`}>
      {children}
    </span>
  );
}

function OutlineBtn({ children, tone = "slate", onClick, disabled }) {
  const tones = {
    blue:  "text-[#49A0E6] ring-1 ring-inset ring-[#49A0E6]/20 hover:bg-[#49A0E6]/10",
    red:   "text-[#DC4600] ring-1 ring-inset ring-[#DC4600]/20 hover:bg-[#DC4600]/10",
    slate: "text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-50",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center rounded-md px-6 py-[9px] text-[16px] font-inter cursor-pointer disabled:opacity-50 ${tones[tone]} transition`}
    >
      {children}
    </button>
  );
}

function ActionCell({ status, onApprove, onReject, busy }) {
  if (status === "active")   return <Badge tone="active">Approved</Badge>;
  if (status === "inactive") return <Badge tone="inactive">Rejected</Badge>;
  // pending/others -> buttons
  return (
    <div className="flex items-center gap-3 text-[16px] font-inter">
      <OutlineBtn tone="blue" onClick={onApprove} disabled={busy === "approve" || busy === "reject"}>
        {busy === "approve" ? "Approving..." : "Approve"}
      </OutlineBtn>
      <OutlineBtn tone="red" onClick={onReject} disabled={busy === "approve" || busy === "reject"}>
        {busy === "reject" ? "Rejecting..." : "Reject"}
      </OutlineBtn>
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

function fmtDate(d) {
  const dt = new Date(d);
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const yy = String(dt.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

export default function AgentApprovalTable() {
  const [page, setPage] = useState(1);
  const [userdata, setUserdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [busyRow, setBusyRow] = useState({}); // { [id]: "approve" | "reject" }

  const totalItems = userdata.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

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

  const currentRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return userdata.slice(start, start + PAGE_SIZE);
  }, [page, userdata]);

  // Load list
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        let raw = Cookies.get("token") || (typeof window !== "undefined" && localStorage.getItem("token")) || "";
        if (raw && raw.startsWith('"') && raw.endsWith('"')) {
          try { raw = JSON.parse(raw); } catch {}
        }
        const token = raw && raw.toString().startsWith("Bearer ") ? raw.toString().slice(7) : raw;

        const res = await fetch(`${LIST_URL}?page=1&limit=${PAGE_SIZE}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();


        const list = (Array.isArray(body) && body) || body?.users || body?.data || body?.items || [];
        const mapped = list.map((u) => ({
          id: u._id ?? u.id,
          sl: u.sl || `#${String(u.id || u._id || "").slice(-4)}`,
          name: u.name || [u.firstName, u.lastName].filter(Boolean).join(" ") || "Unknown",
          email: u.email || "unknown@example.com",
          mobile: u.phone || u.mobile || "-",
          date: u.createdAt ? fmtDate(u.createdAt) : (u.date || ""),
          avatar: u.avatar || u.photoUrl || u.avatarUrl || "/user1.png",
         status: u.status || "pending",

          
        }));

        if (!off) {
          setUserdata(mapped);
          setPage(1);
        }
      } catch (e) {
        console.error("[users] load error:", e);
        if (!off) setErr(e.message || "Failed to load");
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => { off = true; };
  }, []);

  // ✅ Updated: use separate API for approve/reject
  async function updateStatus(rowId, action) {
    let url;
    if (action === "approve") url = `${API_BASE}/admin/approved-user/${rowId}`;
    else if (action === "reject") url = `${API_BASE}/admin/reject-user/${rowId}`;
    else return;

    const prev = userdata;
    setBusyRow((prevBusy) => ({ ...prevBusy, [rowId]: action }));

    try {
      let raw = Cookies.get("token") || (typeof window !== "undefined" && localStorage.getItem("token")) || "";
      if (raw && raw.startsWith('"') && raw.endsWith('"')) {
        try { raw = JSON.parse(raw); } catch {}
      }
      const token = raw && raw.toString().startsWith("Bearer ") ? raw.toString().slice(7) : raw;

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log("res",res.json());

      // success -> update UI
      setUserdata((prevList) =>
        prevList.map((u) =>
          u.id === rowId ? { ...u, status: action === "approve" ? "active" : "inactive" } : u
        )
      );
    } catch (e) {
      console.error("[updateStatus] error:", e);
      setUserdata(prev); // revert
      alert(e.message || "Failed to update status.");
    } finally {
      setBusyRow((prevBusy) => {
        const { [rowId]: _omit, ...rest } = prevBusy;
        return rest;
      });
    }
  }

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // console.log("currentRows",currentRows);
  return (
    <div className="w-full p-7 bg-white overflow-x-auto rounded-[10px]">
      <Header />

      <div className="mt-2 mb-2">
        {loading && <p className="text-sm text-gray-500">Loading…</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>

      <table className="min-w-[720px] w-full text-left table-fixed mt-[18px] ">
        <thead>
          <tr className="bg-white text-[18px] font-inter font-semibold text-[#333333]">
            <th className="py-3 pr-4 w-[10%]">SL No</th>
            <th className="py-3 pr-4 w-[25%]">Agent Name</th>
            <th className="py-3 pr-4 w-[20%]">Submission Date</th>
            <th className="py-3 pr-4 w-[15%] justify-center text-center ">Action</th>
            <th className="py-3 pr-2 w-[30%] fle justify-center items-center text-center">Details</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {!loading && currentRows.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-500">No users found</td>
            </tr>
          )}

          {currentRows.map((r) => {
            const src = r.avatar?.startsWith("/") ? r.avatar : `/${r.avatar}`;
            const busy = busyRow[r.id];

            return (
              <tr key={r.id || r.sl} className="align-middle">
                <td className="py-4 pr-4 text-[#333333] font-inter text-[16px] whitespace-nowrap">{r.sl}</td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9">
                      <Image
                        src={src}
                        alt={r.name}
                        fill
                        sizes="36px"
                        className="rounded-full object-cover ring-2 ring-white shadow"
                      />
                    </div>
                    <span className="text-[#333333] font-inter text-[16px]">{r.name}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">{r.date}</td>
                <td className="py-4 pr-4  w-[15%]">
                  <ActionCell
                    status={r.status}
                    busy={busy}
                    onApprove={() => updateStatus(r.id, "approve")}
                    onReject={() => updateStatus(r.id, "reject")}
                  />
                </td>
                <td className="py-4 pr-2 flex items-center justify-center ">
                  <button
                    type="button"
                    aria-label={`View details of ${r.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#015093] hover:opacity-90 transition"
                  >
                    <EyeIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-6 flex justify-center">
        <nav className="inline-flex items-center gap-4" aria-label="Pagination">
          <button onClick={goPrev} disabled={page === 1} className="text-[#333333] flex items-center gap-4 font-inter text-[16px] disabled:opacity-40 disabled:cursor-not-allowed">
            <IoIosArrowBack /> Previous
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

          <button onClick={goNext} disabled={page === totalPages} className="text-[#333333] flex items-center gap-4 font-inter text-[16px] disabled:opacity-40 disabled:cursor-not-allowed">
            Next <IoIosArrowForward />
          </button>
        </nav>
      </div>
    </div>
  );
}
