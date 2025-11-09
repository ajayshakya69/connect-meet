"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CreateMeetingFormProps {
  onStart: (meetingId: string, userName: string) => void
}

export default function CreateMeetingForm({ onStart }: CreateMeetingFormProps) {
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateMeetingId = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim()) return

    setIsLoading(true)
    // Simulate meeting creation
    await new Promise((resolve) => setTimeout(resolve, 500))

    const meetingId = generateMeetingId()
    onStart(meetingId, userName)
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

      <Button
        type="submit"
        disabled={isLoading || !userName.trim()}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm sm:text-base"
      >
        {isLoading ? "Creating Meeting..." : "Create New Meeting"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        A unique meeting link will be generated for you to share with others.
      </p>
    </form>
  )
}
