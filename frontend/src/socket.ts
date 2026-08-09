import { io } from "socket.io-client";

export const socket = io("https://lolby-production.up.railway.app", {
  withCredentials: true,
  transports: ["polling", "websocket"],
  autoConnect: true,
});
