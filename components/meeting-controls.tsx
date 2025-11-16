"use client";

import { useWebRTC } from "@/providers/webrtcProvider/webrtc.hook";
import type React from "react";

import { useState } from "react";

interface MeetingControlsProps {
  showChat: boolean;
  isScreenSharing: boolean;

  onToggleChat: () => void;
  onToggleScreenShare: () => void;
  onLeave: () => void;
  participantCount: number;
}

interface ControlButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
  isDangerous?: boolean;
}

function ControlButton({
  onClick,
  isActive,
  icon,
  label,
  isDangerous,
}: ControlButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const baseClass = `p-2 sm:p-3 rounded-full transition-all relative group`;
  const activeClass = isActive
    ? isDangerous
      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      : "bg-primary text-primary-foreground hover:bg-primary/90"
    : "bg-secondary text-foreground hover:bg-secondary/80";

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`${baseClass} ${activeClass}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={label}
        title={label}
      >
        {icon}
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap pointer-events-none hidden sm:block">
          {label}
        </div>
      )}
    </div>
  );
}

export default function MeetingControls({
  showChat,
  isScreenSharing,
  onToggleChat,
  onToggleScreenShare,
  onLeave,
  participantCount,
}: MeetingControlsProps) {
  const { isMuted, cameraOff, toggleAudio, toggleVideo } = useWebRTC();

  return (
    <div className="bg-card border-t border-border px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
      {/* Microphone */}
      <ControlButton
        onClick={toggleAudio}
        isActive={!isMuted}
        isDangerous={!isMuted}
        label={!isMuted ? "Unmute" : "Mute"}
        icon={
          !isMuted ? (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 5.23 11.08 5 12 5c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l.98.98c.84-.88 1.35-2.08 1.35-3.4 0-2.64-2.05-4.78-4.65-4.96z" />
              <path d="M3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6 2.23 0 4.13-1.16 5.22-2.9l2.72 2.72c-.54.29-1.13.54-1.75.73C10.25 21.51 9.18 22 8 22 4.14 22 1 18.86 1 15c0-4.04 2.92-7.41 6.75-7.73L3 5.27zM19 13h-3v3h-2v-3h-3v-2h3V8h2v3h3v2z" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.7 2.36-2.2 0-4.23-.9-5.7-2.36M9 18.9c1.47 1.45 3.5 2.35 5.7 2.35s4.23-.9 5.7-2.35" />
            </svg>
          )
        }
      />

      {/* Camera */}
      <ControlButton
        onClick={toggleVideo}
        isActive={!cameraOff}
        isDangerous={!cameraOff}
        label={!cameraOff ? "Turn on camera" : "Turn off camera"}
        icon={
          !cameraOff ? (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.14 13.77L15 8v8l-6.86-2.23z" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-11-7l2.03-2.71H8v5.42h2.97v-2.71z" />
            </svg>
          )
        }
      />

      {/* Screen Share */}
      <ControlButton
        onClick={onToggleScreenShare}
        isActive={isScreenSharing}
        label={isScreenSharing ? "Stop sharing" : "Share screen"}
        icon={
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-8-3l-4-5h3V6h2v3h3l-4 5z" />
          </svg>
        }
      />

      {/* Chat Toggle */}
      <ControlButton
        onClick={onToggleChat}
        isActive={showChat}
        label="Toggle chat"
        icon={
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        }
      />

      {/* Participants */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary rounded-full">
        <svg
          className="w-4 h-4 text-foreground"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
        <span className="text-sm font-medium text-foreground">
          {participantCount}
        </span>
      </div>

      {/* Leave Meeting */}
      <ControlButton
        onClick={onLeave}
        isActive={false}
        isDangerous={true}
        label="Leave meeting"
        icon={
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
          </svg>
        }
      />
    </div>
  );
}
