import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");

export const socket = io(URL, {
  extraHeaders: {
    authorization: `Bearer ${token}`,
  },
});
