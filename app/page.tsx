"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import MeetingRoom from "@/components/meeting-room"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "meeting">("landing")
  const [meetingData, setMeetingData] = useState<{
    meetingId: string
    userName: string
    isCreator: boolean
  } | null>(null)

  const handleStartMeeting = (meetingId: string, userName: string) => {
    setMeetingData({
      meetingId,
      userName,
      isCreator: true,
    })
    setCurrentPage("meeting")
  }

  const handleJoinMeeting = (meetingId: string, userName: string) => {
    setMeetingData({
      meetingId,
      userName,
      isCreator: false,
    })
    setCurrentPage("meeting")
  }

  const handleLeaveMeeting = () => {
    setCurrentPage("landing")
    setMeetingData(null)
  }

  return (
    <main className="w-full h-screen bg-gradient-to-br from-background to-secondary">
      {currentPage === "landing" ? (
        <LandingPage onStartMeeting={handleStartMeeting} onJoinMeeting={handleJoinMeeting} />
      ) : (
        <MeetingRoom meetingData={meetingData!} onLeaveMeeting={handleLeaveMeeting} />
      )}
    </main>
  )
}
