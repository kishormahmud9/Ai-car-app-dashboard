"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import toast from "react-hot-toast";
 
const NotificationContext = createContext();
 
export function SimpleProvider({ children, adminId }) {
  const [notifications, setNotifications] = useState([]);
 
  useEffect(() => {
    if (!adminId) return; // safety check
 
    // 🔹 Fetch existing notifications (authenticated)
    fetch("https://admin-dashboard.drivestai.com/api/notifications", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data.data || []))
      .catch((err) => console.error("Error loading notifications:", err));
 
    // 🔹 Pusher setup
    const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    const CHANNEL = `private-admin-${adminId}`;
    const EVENT = "new-notification";
 
    // ✅ Authenticated Pusher client for private channels
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      authEndpoint: "https://admin-dashboard.drivestai.com/api/pusher/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    });
 
    const channel = pusher.subscribe(CHANNEL);
 
    // 🔹 Listen to new-notification event
    channel.bind(EVENT, (rawData) => {
      const newNotif = {
        id: rawData.notificationId,
        title: rawData.title || "New Notification",
        details: rawData.message,
        time: rawData.createdAt,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      toast.success(`${newNotif.title}: ${newNotif.details}`);
    });
 
    // 🔹 Cleanup
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(CHANNEL);
      pusher.disconnect();
    };
  }, [adminId]);
 
  const unreadCount = notifications.length;
 
  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
 
export function useNotifications() {
  return useContext(NotificationContext);
}