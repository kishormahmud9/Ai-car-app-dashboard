"use client";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Header from "@/app/component/Header";
import Cookies from "js-cookie";

const API_BASE = "https://admin-dashboard.drivestai.com";
const CARS_URL = `${API_BASE}/admin/cars?initial=true`;
const PAGE_SIZE = 10;

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

export default function AgentApprovalTable() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [confirmName, setConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message }

  const getAuthHeader = () => {
    let token = Cookies.get("token") || localStorage.getItem("token") || "";
    if (token && token.startsWith('"') && token.endsWith('"')) {
      try {
        token = JSON.parse(token);
      } catch {}
    }
    if (token.startsWith("Bearer ")) token = token.slice(7);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // load cars
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(CARS_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
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
        const list = Array.isArray(body)
          ? body
          : body?.cars || body?.data || body?.items || [];

        const mapped = list.map((c, i) => ({
          id: c._id ?? c.id ?? `${i}`,
          sl: c.sl || `#${String(c._id || c.id || i).slice(-4)}`,
          car: c.carName || c.name || c.model || c.title || "Unknown Car",
          location: normalizeLocation(c.location),
          year: c.year,
          brand: c.brand,
          mileage: c.mileage,
          price:
            typeof c.price === "number"
              ? `$${c.price.toLocaleString()}`
              : c.price || "$0",
          image:
            c.image ||
            c.images?.[0] ||
            c.photo ||
            c.thumbnail ||
            c.carImage ||
            "/no_image_available.jpg",
          date: fmtDate(c.createdAt || c.dateAdded || c.created_on),
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

  const openConfirm = (row) => {
    setConfirmId(row.id);
    setConfirmName(row.car);
  };

  const closeConfirm = () => {
    if (deleting) return;
    setConfirmId(null);
    setConfirmName("");
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE}/admin/car/${confirmId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
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

      setRows((prev) => prev.filter((r) => r.id !== confirmId));

      // যদি current পেজ empty হয়ে যায় আর আগের পেজ থাকে, setPage কমিয়ে দেই
      setPage((p) => {
        const newTotalPages = Math.max(
          1,
          Math.ceil((rows.length - 1) / PAGE_SIZE)
        );
        return Math.min(p, newTotalPages);
      });

      showToast("success", "Car deleted successfully");
      closeConfirm();
    } catch (e) {
      showToast("error", e.message || "Failed to delete car");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative w-full p-7 bg-white overflow-x-auto rounded-[10px]">
      <Header />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow text-white text-sm ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Status */}
      <div className="mt-2 mb-2">
        {loading && <p className="text-sm text-gray-500">Loading…</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>

      {/* Table */}
      <table className="min-w-[920px] w-full text-left table-fixed mt-[18px]">
        <thead>
          <tr className="bg-white text-[18px] font-inter font-semibold text-[#333333]">
            <th className="py-3 pr-4 w-[8%]">SL No</th>
            <th className="py-3 pr-2 w-[15%]">Car Name</th>
            <th className="py-3 pr-2 w-[12%]">Location</th>
            <th className="py-3 pr-2 w-[8%]">Year</th>
            <th className="py-3 pr-2 w-[12%]">Brand</th>
            <th className="py-3 pr-2 w-[10%]">Price</th>
            <th className="py-3 pr-2 w-[10%]">Mileage</th>
            <th className="py-3 pr-2 w-[10%]">Image</th>
            <th className="py-3 pr-2 w-[10%]">Date Added</th>
            <th className="py-3 pr-2 w-[10%]">Action</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={10} className="py-6 text-center text-gray-500">
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
                {r.year ?? "N/A"}
              </td>
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">
                {r.brand ?? "N/A"}
              </td>
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">
                {r.price}
              </td>
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">
                {r.mileage ? `${r.mileage} KM` : "N/A"}
              </td>
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">
                <img
                  src={r.image}
                  alt={r.car}
                  height={100}
                  width={100}
                  className="h-[60px] w-[100px] object-cover rounded-md border border-slate-200"
                />
              </td>
              <td className="py-4 pr-4 text-[#333333] font-inter text-[16px]">
                {r.date}
              </td>
              <td className="py-4 pr-4">
                <button
                  type="button"
                  onClick={() => openConfirm(r)}
                  className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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

      {/* Confirm Delete Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-[#333333] mb-2">
              Are you sure you want to delete this?
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Car: <span className="font-medium">{confirmName}</span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeConfirm}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}