import Pusher from "pusher-js";
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: "/api/pusher/auth", // protected/private channels authenticationauth: {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"), // JWT token    },
  },
  credentials: "include",
});
export default pusher;