import { useContext } from "react";
import { WebRtcConext } from "./webrtc.context";

export const useWebRTC = () => {
  const ctx = useContext(WebRtcConext);

  if (!ctx) throw new Error("useWebRTC must be used within WebRTCProvider");

  return ctx;
};
