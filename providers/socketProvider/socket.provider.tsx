"use client";

import { useEffect, useState } from "react";
import { SocketContext } from "./socket.hook";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const params = useSearchParams();
  const meetingId = params.get("meeting_id");

  useEffect(() => {
    const sc: Socket = io("http://localhost:4000/webRTC-socket", {
      transports: ["websocket"],
    });

    setSocket(sc);

    sc.on("connect", () => {
      console.log("🔌 Socket Connected:", sc.id);
    });

    sc.on("disconnect", () => {
      console.log("🔌 Socket Disconnected");
    });

    sc.on("meeting-joined", ({ meetingId }) => {
      console.log("✅ Meeting joined:", meetingId);
    });

    sc.on("user-joined", ({ userId, meetingId }) => {
      console.log(`👤 User ${userId} joined meeting ${meetingId}`);
    });

    return () => {
      sc.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    if (!meetingId || meetingId === "null") return;

    console.log("➡️ Joining or creating meeting:", meetingId);

    socket.emit("join-or-create-meeting", { meetingId: meetingId });
  }, [socket, meetingId]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
