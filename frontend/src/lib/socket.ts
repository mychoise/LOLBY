// lib/socket.ts
import { io, Socket } from "socket.io-client";

const SERVER_URL =
  (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:3000";

export const socket: Socket = io(SERVER_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: true,
});

