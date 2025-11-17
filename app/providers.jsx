// app/providers.jsx
"use client";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Providers({ children }) {
  // Optional: app লোডে axios এ Bearer টোকেন বসিয়ে দাও
  useEffect(() => {
    const t = Cookies.get("token");
    if (t) axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  }, []);

  return <>{children}</>;
}
