"use client";

import { useWebRTC } from "@/providers/webrtcProvider/webrtc.hook";
import { useEffect, useRef } from "react";

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
  const { videoStream, remoteStreams } = useWebRTC();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll selected user into center
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const elem = document.querySelector(
      `[data-participant-id="${mainParticipantId}"]`,
    );

    if (elem) {
      elem.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [mainParticipantId]);

  return (
    <div className="bg-black/50 border-t border-border h-28 sm:h-32 md:h-36 flex items-center gap-3 px-4 relative group">
      {/* -------- LOCAL VIDEO -------- */}
      <Participant
        id="0"
        name="You"
        isActive={mainParticipantId === "0"}
        videoEnabled={true}
        stream={videoStream}
        onClick={() => onSelectParticipant("0")}
      />

      {/* -------- REMOTE USERS -------- */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto scrollbar-hide flex gap-3 pr-2"
      >
        {participants.map((p) => (
          <Participant
            key={p.id}
            id={p.id}
            name={p.name}
            isActive={mainParticipantId === p.id}
            videoEnabled={p.videoEnabled}
            stream={remoteStreams} // SAME stream for all
            onClick={() => onSelectParticipant(p.id)}
          />
        ))}
      </div>

      {/* Hide Scrollbars */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

/* -----------------------------------------------------
   PARTICIPANT BOX (INLINE INSIDE THE SAME COMPONENT)
----------------------------------------------------- */
function Participant({
  id,
  name,
  stream,
  isActive,
  videoEnabled,
  onClick,
}: {
  id: string;
  name: string;
  stream: MediaStream | null;
  isActive: boolean;
  videoEnabled: boolean;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Attach stream after DOM exists
  useEffect(() => {
    if (videoRef.current && stream && videoEnabled) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(() => {});
      };
    }
  }, [stream, videoEnabled]);

  const initials = name[0]?.toUpperCase() ?? "?";

  return (
    <div
      onClick={onClick}
      data-participant-id={id}
      className={`relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2
        h-24 sm:h-28 md:h-32 w-32 sm:w-36 md:w-40 transition-all duration-300
        ${
          isActive
            ? "border-primary ring-2 ring-primary shadow-lg shadow-primary/40"
            : "border-border hover:border-primary/50"
        }
      `}
    >
      {stream && videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={name === "You"} // Only local muted
          className="w-full h-full object-cover bg-black"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-900">
          <span className="text-white text-lg font-bold">{initials}</span>
        </div>
      )}

      {/* Name Tag */}
      <div className="absolute bottom-0 w-full bg-black/60 text-white text-xs sm:text-sm p-1 text-center">
        {name}
      </div>
    </div>
  );
}
