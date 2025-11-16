"use client";

import { useState } from "react";
import LandingPage from "@/components/landing-page";
import MeetingRoom from "@/components/meeting-room";
import { useWebRTC } from "@/providers/webrtcProvider/webrtc.hook";

export default function Home() {
  const { currentPage } = useWebRTC();

  return (
    <main className="w-full h-screen bg-gradient-to-br from-background to-secondary">
      {currentPage === "landing" ? <LandingPage /> : <MeetingRoom />}
    </main>
  );
}
