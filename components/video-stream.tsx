"use client";

import { useWebRTC } from "@/providers/webrtcProvider/webrtc.hook";
import { useEffect, useRef } from "react";

interface Participant {
  id: string;
  name: string;
  videoEnabled: boolean;
}

interface VideoStreamProps {
  mainParticipantId: string;
  currentUserName: string;
  participants: Participant[];
  isMuted: boolean;
  cameraOff: boolean;
  isScreenSharing: boolean;
}

export default function VideoStream({
  mainParticipantId,
  currentUserName,
  participants,
  isMuted,
  cameraOff,
  isScreenSharing,
}: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { videoStream } = useWebRTC();

  const mainParticipant =
    mainParticipantId === "0"
      ? currentUserName
      : participants.find((p) => p.id === mainParticipantId)?.name ||
        currentUserName;

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  const isVideoActive = !cameraOff && videoStream;

  return (
    <div className="flex-1 flex flex-col bg-black relative min-h-0 overflow-hidden">
      {isScreenSharing ? (
        // ✅ Screen Share View
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-black via-purple-900/20 to-black">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="w-24 h-24 sm:w-32 sm:h-32 text-purple-500/50"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-8-3l-4-5h3V6h2v3h3l-4 5z" />
            </svg>
            <p className="text-white text-lg sm:text-xl">
              {mainParticipantId === "0" ? "Your" : `${mainParticipant}'s`}{" "}
              screen
            </p>
          </div>
        </div>
      ) : isVideoActive ? (
        // ✅ Real Live Video
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={mainParticipantId === "0"}
          className="w-full h-full object-cover bg-black"
        />
      ) : (
        // ❌ No video fallback (same aesthetic as before)
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-black via-purple-900/20 to-black">
          <div className="flex flex-col items-center">
            {/* Avatar Circle */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-purple-600/30 border border-purple-400/20 flex items-center justify-center">
              <span className="text-5xl sm:text-6xl font-bold text-white">
                {mainParticipant[0]?.toUpperCase() || "?"}
              </span>
            </div>
            {/* Name Label */}
            <p className="mt-4 text-white text-lg sm:text-xl font-semibold">
              {mainParticipant}
            </p>
            {/* Camera Off label */}
            {mainParticipantId === "0" && cameraOff && (
              <div className="mt-3 px-4 py-2 bg-red-600/80 rounded-lg text-white text-sm">
                Camera Off
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ Bottom Overlay (User Info) */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          {!isMuted && (
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
          <span className="text-white text-xs sm:text-sm">
            {mainParticipantId === "0" ? "You" : mainParticipant}
          </span>
        </div>
      </div>

      {/* ✅ Top-right Video Quality Indicator */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-black/70 backdrop-blur-md px-2 sm:px-3 py-1 rounded text-xs text-green-400">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
        </svg>
        HD
      </div>
    </div>
  );
}
