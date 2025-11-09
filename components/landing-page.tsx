"use client"

import { useState } from "react"
import JoinMeetingForm from "./join-meeting-form"
import CreateMeetingForm from "./create-meeting-form"

interface LandingPageProps {
  onStartMeeting: (meetingId: string, userName: string) => void
  onJoinMeeting: (meetingId: string, userName: string) => void
}

export default function LandingPage({ onStartMeeting, onJoinMeeting }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create")

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M3 21v-2a6 6 0 0112 0v2M18 20a6 6 0 01-9 0" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2 text-balance">
            ConnectMeet
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Crystal clear video meetings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-5 sm:mb-6 bg-card rounded-lg p-1">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-md font-medium text-sm sm:text-base transition-all ${
              activeTab === "create" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-md font-medium text-sm sm:text-base transition-all ${
              activeTab === "join" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
            }`}
          >
            Join
          </button>
        </div>

        {/* Form Content */}
        <div className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-border">
          {activeTab === "create" ? (
            <CreateMeetingForm onStart={onStartMeeting} />
          ) : (
            <JoinMeetingForm onJoin={onJoinMeeting} />
          )}
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 px-2">
          No account needed. Meeting links expire after 24 hours.
        </p>
      </div>
    </div>
  )
}
