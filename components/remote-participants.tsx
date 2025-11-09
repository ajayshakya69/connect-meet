"use client";

import { useWebRTC } from "@/providers/webrtc-provider/webrtc.hook";
import { useEffect, useRef } from "react";
// ⬅️ your WebRTC hook

interface Participant {
  id: string;
  name: string;
  videoEnabled: boolean;
}

interface RemoteParticipantsProps {
  participants: Participant[];
  mainParticipantId: string;
  onSelectParticipant: (participantId: string) => void;
}

export default function RemoteParticipants({
  participants,
  mainParticipantId,
  onSelectParticipant,
}: RemoteParticipantsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { videoStream, remoteStreams } = useWebRTC();

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollTo({
        left:
          scrollContainerRef.current.scrollLeft +
          (direction === "right" ? scrollAmount : -scrollAmount),
        behavior: "smooth",
      });
    }
  };

  // Keep selected participant in view
  useEffect(() => {
    if (scrollContainerRef.current && mainParticipantId !== "0") {
      const selectedElement = document.querySelector(
        `[data-participant-id="${mainParticipantId}"]`,
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [mainParticipantId]);

  // Helper to get remote stream for a participant
  const getRemoteStream = (participantId: string) =>
    remoteStreams?.find((r: any) => r.participantId === participantId)
      ?.stream || null;

  return (
    <div className="bg-black/50 border-t border-border h-28 sm:h-32 md:h-36 flex items-center gap-2 sm:gap-3 px-2 sm:px-4 relative group">
      {/* Left Scroll Button */}
      {participants.length > 3 && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-2 z-10 bg-primary/80 hover:bg-primary p-1.5 sm:p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
      )}

      {/* ✅ Local Video (You) */}
      <div
        onClick={() => onSelectParticipant("0")}
        className={`relative shrink-0 cursor-pointer transition-all duration-300 rounded-lg overflow-hidden border-2 h-24 sm:h-28 md:h-32 w-32 sm:w-36 md:w-40 group/card ${
          mainParticipantId === "0"
            ? "border-primary ring-2 ring-primary"
            : "border-border hover:border-primary/50"
        }`}
        data-participant-id="0"
      >
        {videoStream ? (
          <video
            ref={(video) => {
              if (video && videoStream) video.srcObject = videoStream;
            }}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover bg-black"
          />
        ) : (
          // ❌ fallback if no local video
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-900">
            <span className="text-white text-lg font-bold">You</span>
          </div>
        )}

        {/* Name label */}
        <div className="absolute inset-0 flex items-end p-1.5 sm:p-2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
          <span className="text-white text-xs sm:text-sm font-medium truncate">
            You
          </span>
        </div>
      </div>

      {/* ✅ Remote Participants */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto scrollbar-hide flex gap-2 sm:gap-3 pr-2"
      >
        {participants.map((participant) => {
          const remoteStream = getRemoteStream(participant.id);
          const isActive = mainParticipantId === participant.id;
          const initials = participant.name[0]?.toUpperCase() || "?";

          return (
            <div
              key={participant.id}
              data-participant-id={participant.id}
              onClick={() => onSelectParticipant(participant.id)}
              className={`relative flex-shrink-0 cursor-pointer transition-all duration-300 rounded-lg overflow-hidden border-2 h-24 sm:h-28 md:h-32 w-32 sm:w-36 md:w-40 group/card ${
                isActive
                  ? "border-primary ring-2 ring-primary shadow-lg shadow-primary/50"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {remoteStream && participant.videoEnabled ? (
                <video
                  ref={(video) => {
                    if (video && remoteStream) video.srcObject = remoteStream;
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                // ❌ fallback if no video
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-900">
                  <span className="text-white text-lg font-bold">
                    {initials}
                  </span>
                </div>
              )}

              {/* Name Label */}
              <div className="absolute inset-0 flex flex-col items-end justify-between p-1.5 sm:p-2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                <div className="text-right">
                  <span className="text-white text-xs sm:text-sm font-medium truncate block">
                    {participant.name.split(" ")[0]}
                  </span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              {/* Status Dots */}
              <div className="absolute top-1 right-1 flex gap-1">
                <div
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                    participant.videoEnabled ? "bg-green-500" : "bg-gray-500"
                  }`}
                  title={participant.videoEnabled ? "Camera on" : "Camera off"}
                />
                <div
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500"
                  title="Audio on"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Scroll Button */}
      {participants.length > 3 && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-2 z-10 bg-primary/80 hover:bg-primary p-1.5 sm:p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      )}

      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
