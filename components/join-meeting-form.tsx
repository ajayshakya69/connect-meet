"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface JoinMeetingFormProps {
  onJoin: (meetingId: string, userName: string) => void
}

export default function JoinMeetingForm({ onJoin }: JoinMeetingFormProps) {
  const [meetingCode, setMeetingCode] = useState("")
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetingCode.trim() || !userName.trim()) return

    setIsLoading(true)
    // Simulate joining meeting
    await new Promise((resolve) => setTimeout(resolve, 500))

    onJoin(meetingCode.toUpperCase(), userName)
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Your Name</label>
        <Input
          type="text"
          placeholder="Enter your full name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Meeting Code</label>
        <Input
          type="text"
          placeholder="Enter 9-digit meeting code"
          value={meetingCode}
          onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
          maxLength={9}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !meetingCode.trim() || !userName.trim()}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-medium text-sm sm:text-base"
      >
        {isLoading ? "Joining..." : "Join Meeting"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">Ask the meeting organizer for the meeting code.</p>
    </form>
  )
}
