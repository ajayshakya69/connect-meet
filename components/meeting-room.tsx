"use client";

import { useState } from "react";
import VideoStream from "./video-stream";
import RemoteParticipants from "./remote-participants";
import ChatSidebar from "./chat-sidebar";
import MeetingControls from "./meeting-controls";
import { useWebRTC } from "@/providers/webrtc-provider/webrtc.hook";

interface MeetingRoomProps {
  meetingData: {
    meetingId: string;
    userName: string;
    isCreator: boolean;
  };
  onLeaveMeeting: () => void;
}

export default function MeetingRoom({
  meetingData,
  onLeaveMeeting,
}: MeetingRoomProps) {
  const [showChat, setShowChat] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mainParticipantId, setMainParticipantId] = useState("0"); // "0" for self
  const [participants, setParticipants] = useState([
    { id: "1", name: "John Smith", videoEnabled: true },
    { id: "2", name: "Sarah Johnson", videoEnabled: true },
    { id: "3", name: "Mike Chen", videoEnabled: true },
    { id: "4", name: "Emma Davis", videoEnabled: true },
    { id: "5", name: "Alex Taylor", videoEnabled: true },
  ]);

  const { videoStream, toggleAudio, toggleVideo } = useWebRTC();

  const toggleChat = () => setShowChat(!showChat);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleCamera = () => setCameraOff(!cameraOff);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary flex-shrink-0">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M3 21v-2a6 6 0 0112 0v2M18 20a6 6 0 01-9 0" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground text-sm sm:text-base truncate">
              ConnectMeet
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {meetingData.meetingId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs sm:text-sm text-muted-foreground px-2 sm:px-3 py-1 bg-secondary rounded-full whitespace-nowrap">
            {participants.length + 1}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-0 min-h-0">
        {/* Video Stream Section */}
        <div className="flex-1 flex flex-col min-w-0">
          <VideoStream
            mainParticipantId={mainParticipantId}
            currentUserName={meetingData.userName}
            participants={participants}
            isMuted={isMuted}
            cameraOff={cameraOff}
            isScreenSharing={isScreenSharing}
          />

          {/* Remote Participants Horizontal Scroll */}
          <RemoteParticipants
            participants={participants}
            mainParticipantId={mainParticipantId}
            onSelectParticipant={setMainParticipantId}
          />
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-64 sm:w-72 md:w-80 border-l border-border bg-card flex flex-col max-sm:fixed max-sm:right-0 max-sm:top-0 max-sm:bottom-0 max-sm:z-50 max-sm:w-full">
            <ChatSidebar
              userName={meetingData.userName}
              onClose={() => setShowChat(false)}
            />
          </div>
        )}
      </div>

      {/* Meeting Controls */}
      <MeetingControls
        showChat={showChat}
        isScreenSharing={isScreenSharing}
        onToggleChat={toggleChat}
        onToggleScreenShare={toggleScreenShare}
        onLeave={onLeaveMeeting}
        participantCount={participants.length + 1}
      />
    </div>
  );
}
