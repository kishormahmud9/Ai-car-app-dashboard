"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

import Image from "next/image";
import users from "@/public/users.png";
import income from "@/public/income.png";
import listings from "@/public/listings.png";
import IncomeBar from "../../component/IncomeBar";
import GrowthBar from "../../component/GrowthBar";
import { IoIosArrowDown } from "react-icons/io";
import Container from "../../component/Container";

const API_BASE = "https://admin-dashboard.drivestai.com";

/* ---------------- helpers ---------------- */
const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const yy = String(dt.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
};

// Normalize API user object
const normalizeUser = (u, idx) => {
  const id = u._id ?? u.id ?? `local-${idx}`;
  const name =
    u.name ||
    [u.firstName, u.lastName].filter(Boolean).join(" ") ||
    u.username ||
    u.email ||
    "Unknown";

  const avatar =
    u.avatar ||
    u.photoUrl ||
    u.avatarUrl ||
    u.image ||
    u.profilePic ||
    u.avatar_url ||
    "/user-placeholder.png";

  const date =
    u.createdAt || u.created_at || u.submittedAt || u.registrationDate || u.date || "";

  const status = (u.status || u.verificationStatus || "pending").toString();

  const sl = u.sl || `#${String(id).slice(-4)}`;

  return { id, sl, name, avatar, date, status, raw: u };
};

// Avatar component
function Avatar({ src, alt, size = 36 }) {
  const isExternal = typeof src === "string" && /^https?:\/\//i.test(src);
  if (isExternal) {
    return (
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{ width: size, height: size, borderRadius: "999px", objectFit: "cover" }}
        className="ring-2 ring-white shadow"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover ring-2 ring-white shadow"
    />
  );
}

/* ---------------- component ---------------- */
export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);
  const [yearIncome, setYearIncome] = useState(false);
  const [yearGrowth, setYearGrowth] = useState(false);
  const [yearValue, setYearValue] = useState("2025");
  const [yearValue2, setYearValue2] = useState("2025");

  const [carCount, setCarCount] = useState(0);
  const [busyRow, setBusyRow] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [verificationUsers, setVerificationUsers] = useState([]);

  // 🔥 NEW: total income
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchCarCount = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch(`${API_BASE}/admin/cars?initial=true`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const json = await safeJson(res);
        const list = Array.isArray(json) ? json : json?.data || json?.cars || [];
        if (mounted) setCarCount(Array.isArray(list) ? list.length : 0);
      } catch {
        if (mounted) setCarCount(0);
      }
    };

    const fetchUserCount = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch(`${API_BASE}/admin/user-list`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const json = await safeJson(res);
        const list = Array.isArray(json) ? json : json?.data || json?.users || json?.items || [];
        if (mounted)
          setUserCount(Array.isArray(list) ? list.length : Number(json?.total) || 0);
      } catch {
        if (mounted) setUserCount(0);
      }
    };

    const fetchVerificationUsers = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch(`${API_BASE}/admin/user-list`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const json = await safeJson(res);
        const list = Array.isArray(json) ? json : json?.data || json?.users || json?.items || [];
        if (!mounted) return;

        const normalized = list.map((u, idx) => normalizeUser(u, idx));
        setVerificationUsers(normalized);
      } catch {
        if (mounted) setVerificationUsers([]);
      }
    };

    // 🔥 NEW: fetch invoices to sum totalAmount
    const fetchTotalIncome = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch(`${API_BASE}/admin/invoices`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const json = await safeJson(res);

        const invoices = Array.isArray(json)
          ? json
          : json?.data || json?.invoices || [];

        if (!mounted) return;

        let sum = invoices.reduce((acc, inv) => {
          if (inv.status === "paid") {
            return acc + (Number(inv.totalAmount) || 0);
          }
          return acc;
        }, 0);

        setTotalIncome(sum);
      } catch {
        if (mounted) setTotalIncome(0);
      }
    };

    fetchCarCount();
    fetchUserCount();
    fetchVerificationUsers();
    fetchTotalIncome(); // 🔥 CALL HERE

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setReady(true);
  }, [router, pathname]);

  if (!ready) return null;

  const years = ["2025", "2024", "2023", "2022", "2021", "2020"];

  /* ---------- components ---------- */

  function Badge({ children, tone }) {
    const color =
      tone === "active"
        ? "text-[#0DBF69] bg-[#0DBF69]/10 ring-1 ring-[#0DBF69]/20"
        : tone === "inactive"
        ? "text-[#DC4600] bg-[#DC4600]/10 ring-1 ring-[#DC4600]/20"
        : "text-slate-600 bg-slate-100 ring-1 ring-slate-200";

    return (
      <span className={`inline-flex items-center rounded-[5px] px-6 py-[9px] text-[16px] font-inter ${color}`}>
        {children}
      </span>
    );
  }

  function OutlineBtn({ children, tone = "slate", onClick, disabled }) {
    const tones = {
      blue: "text-[#49A0E6] ring-1 ring-[#49A0E6]/20 hover:bg-[#49A0E6]/10",
      red: "text-[#DC4600] ring-1 ring-[#DC4600]/20 hover:bg-[#DC4600]/10",
      slate: "text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50",
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center rounded-md px-6 py-[9px] text-[16px] font-inter cursor-pointer disabled:opacity-50 transition ${tones[tone]}`}
      >
        {children}
      </button>
    );
  }

  function ActionCell({ status, onApprove, onReject, busy }) {
    if (status === "active") return <Badge tone="active">Approved</Badge>;
    if (status === "inactive") return <Badge tone="inactive">Rejected</Badge>;

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

  async function updateStatus(rowId, action) {
    let url;

    if (action === "approve") url = `${API_BASE}/admin/approved-user/${rowId}`;
    else if (action === "reject") url = `${API_BASE}/admin/reject-user/${rowId}`;
    else return;

    const prev = verificationUsers;
    setBusyRow((s) => ({ ...s, [rowId]: action }));

    try {
      setVerificationUsers((prevList) =>
        prevList.map((u) =>
          u.id === rowId ? { ...u, status: action === "approve" ? "active" : "inactive" } : u
        )
      );

      let raw = Cookies.get("token") || localStorage.getItem("token") || "";
      if (raw && raw.startsWith('"') && raw.endsWith('"')) {
        try {
          raw = JSON.parse(raw);
        } catch {}
      }
      const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
    } catch (err) {
      setVerificationUsers(prev);
      alert(err.message || "Failed to update status");
    } finally {
      setBusyRow((s) => {
        const { [rowId]: removed, ...rest } = s;
        return rest;
      });
    }
  }

  /* ---------- pending items ---------- */
  const pendingItems = verificationUsers.filter((u) => {
    const st = (u.status || "").toLowerCase();
    return st === "pending" || st === "awaiting" || st === "pending_review";
  });

  const rowsToShow = pendingItems.slice(0, 4);

  /* ---------- render ---------- */

  return (
    <div>
      <Container className="grid grid-cols-12 grid-rows-2 gap-[18px]">

        {/* Total Users */}
        <div className="bg-white rounded-[10px] flex flex-col justify-center items-center py-8 gap-[14px] col-span-4 ">
          <p className="font-inter font-medium text-[20px] text-[#333333]">Total Users</p>
          <Image src={users} alt="Total Users" />
          <p className="font-inter font-semibold text-[24px] text-[#333333]">{userCount}</p>
        </div>

        {/* 🔥 Total Income */}
        <div className="bg-white rounded-[10px] flex flex-col justify-center items-center py-8 gap-[14px] col-span-4 ">
          <p className="font-inter font-medium text-[20px] text-[#333333]">Total Income</p>
          <Image src={income} alt="Total Income" />
          <p className="font-inter font-semibold text-[24px] text-[#333333]">
            $
            {totalIncome.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Active Listings */}
        <div className="bg-white rounded-[10px] flex flex-col justify-center items-center py-8 gap-[14px] col-span-4 ">
          <p className="font-inter font-medium text-[20px] text-[#333333]">Active Listings</p>
          <Image src={listings} alt="Active Listings" />
          <p id="car-count" className="font-inter font-semibold text-[24px] text-[#333333]">
            {carCount}
          </p>
        </div>

        {/* Income Overview */}
        <div className="col-span-6 bg-white rounded-[5px] py-[25px] px-5 ">
          <div className="mb-[30px] flex items-center justify-between">
            <h3 className="font-inter font-semibold text-[18px] text-[#333333]">Income Overview</h3>
            <div className="relative cursor-pointer">
              <div onClick={() => setYearIncome(!yearIncome)}>
                <input
                  readOnly
                  className="outline-none w-[75px] border border-[#767676] py-[6px] pl-2.5 pr-1 rounded-[5px] font-inter text-[14px] text-[#333333]"
                  placeholder={yearValue}
                />
                {yearIncome ? (
                  <IoIosArrowDown className="absolute top-1/2 right-0 -translate-y-1/2 w-6 h-6 rotate-180" />
                ) : (
                  <IoIosArrowDown className="absolute top-1/2 right-0 -translate-y-1/2 w-6 h-6" />
                )}
                <div
                  className={`w-full text-center bg-white font-inter text-[14px] text-[#333333] z-30 absolute ${
                    yearIncome ? "opacity-100 h-auto visible" : "opacity-0 h-0 invisible"
                  }`}
                >
                  {["2025", "2024", "2023", "2022", "2021", "2020"].map((y) => (
                    <div
                      key={y}
                      onClick={() => {
                        setYearValue(y);
                        setYearIncome(false);
                      }}
                      className="py-2 hover:bg-[#015093] hover:text-white cursor-pointer"
                    >
                      {y}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-full">
            <IncomeBar />
          </div>
        </div>

        {/* User Growth */}
        <div className="col-span-6 bg-white rounded-[5px] py-[25px] px-5">
          <div className="mb-[30px] flex items-center justify-between">
            <h3 className="font-inter font-semibold text-[18px] text-[#333333]">User Growth</h3>
            <div className="relative cursor-pointer">
              <div onClick={() => setYearGrowth(!yearGrowth)}>
                <input
                  readOnly
                  className="outline-none w-[75px] border border-[#767676] py-[6px] pl-2.5 pr-1 rounded-[5px] font-inter text-[14px] text-[#333333]"
                  placeholder={yearValue2}
                />
                {yearGrowth ? (
                  <IoIosArrowDown className="absolute top-1/2 right-0 -translate-y-1/2 w-6 h-6 rotate-180" />
                ) : (
                  <IoIosArrowDown className="absolute top-1/2 right-0 -translate-y-1/2 w-6 h-6" />
                )}
                <div
                  className={`w-full text-center bg-white font-inter text-[14px] text-[#333333] z-30 absolute ${
                    yearGrowth ? "opacity-100 h-auto visible" : "opacity-0 h-0 invisible"
                  }`}
                >
                  {["2025", "2024", "2023", "2022", "2021", "2020"].map((y) => (
                    <div
                      key={y}
                      onClick={() => {
                        setYearValue2(y);
                        setYearGrowth(false);
                      }}
                      className="py-2 hover:bg-[#015093] hover:text-white cursor-pointer"
                    >
                      {y}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <GrowthBar year={yearValue2} />
        </div>

        {/* Verification Center */}
        <div className="col-span-12 bg-white rounded-[5px] py-[25px] px-[22px]">
          <div className="mb-[29px] flex items-center justify-between">
            <h3 className="text-[#333333] text-[20px] font-inter font-semibold capitalize">
              verification center
            </h3>
            <a
              className="text-[#015093] text-[14px] font-inter font-medium"
              href="/verification/center"
            >
              View all
            </a>
          </div>

          <table className="min-w-[720px] w-full text-left table-fixed">
            <thead>
              <tr className="bg-white text-[18px] font-inter font-semibold text-[#333333]">
                <th className="py-3 pr-4 w-[10%]">SL No</th>
                <th className="py-3 pr-4 w-[25%]">Agent Name</th>
                <th className="py-3 pr-4 w-[20%]">Submission Date</th>
                <th className="py-3 pr-4 w-[15.4%] text-center">Action</th>
                <th className="py-3 pr-2 w-[30%] text-center">Details</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {rowsToShow.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center font-inter text-[16px] text-[#333333]"
                  >
                    No pending verification items.
                  </td>
                </tr>
              ) : (
                rowsToShow.map((r, idx) => {
                  const busy = busyRow[r.id];
                  return (
                    <tr key={r.id || idx} className="align-middle">
                      <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">
                        {r.sl}
                      </td>

                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={r.avatar} size={36} alt="avatar" />
                          <span className="text-[#333333] font-inter text-[16px]">
                            {r.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">
                        {r.date ? new Date(r.date).toLocaleDateString() : "—"}
                      </td>

                      <td className="py-4 pr-4 text-center">
                        <ActionCell
                          status={r.status}
                          busy={busy}
                          onApprove={() => updateStatus(r.id, "approve")}
                          onReject={() => updateStatus(r.id, "reject")}
                        />
                      </td>

                      <td className="py-4 pr-2 flex items-center justify-center">
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#015093] hover:opacity-90 transition"
                        >
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
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                              stroke="white"
                              strokeWidth="2"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}
