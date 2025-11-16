"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebRTC } from "@/providers/webrtcProvider/webrtc.hook";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isSystemMessage?: boolean;
}

interface ChatSidebarProps {
  userName: string;
  onClose: () => void;
}

export default function ChatSidebar({ userName, onClose }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "sys-1",
      sender: "System",
      content: `${userName} joined the meeting`,
      timestamp: new Date(Date.now() - 10 * 60000),
      isSystemMessage: true,
    },
    {
      id: "1",
      sender: "John Smith",
      content: "Hey everyone! Thanks for joining.",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      id: "2",
      sender: "Sarah Johnson",
      content: "Hi! Looking forward to the discussion.",
      timestamp: new Date(Date.now() - 3 * 60000),
    },
  ]);

  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: userName,
      content: messageInput,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const unreadCount = 0;

  const {
    offer,
    answer,
    createOffer,
    createAnswer,
    handleAnswer,
    setOffer,
    setAnswer,
  } = useWebRTC();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}

      <div>
        <div className="p-4 space-y-2 border-b border-border bg-card flex flex-col">
          <input
            type="text"
            value={offer ? JSON.stringify(offer) : ""}
            onChange={(e) => {
              try {
                setOffer(JSON.parse(e.target.value));
              } catch {
                console.warn("Invalid JSON for offer");
              }
            }}
            placeholder="Generated the offer"
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <div className="p-4 space-y-2 border-b border-border bg-card flex flex-row">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={createOffer}
            >
              Generate Offer
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={createAnswer}
            >
              Add Offer
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2 border-b border-border bg-card flex flex-col">
          <input
            type="text"
            value={answer ? JSON.stringify(answer) : ""}
            onChange={(e) => {
              try {
                setAnswer(JSON.parse(e.target.value));
              } catch {
                console.warn("Invalid JSON for answer");
              }
            }}
            placeholder="Add the answer"
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <div className="p-4 space-y-2 border-b border-border bg-card flex flex-row">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleAnswer}
            >
              Add Answer
            </button>
          </div>
        </div>
        <div className="p-4 space-y-2 border-b border-border bg-card flex flex-col">
          <input
            type="text"
            placeholder="add the remote answer"
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Candidate
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
            Chat
          </h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded"
          aria-label="Close chat"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.isSystemMessage ? "items-center" : "items-start"}`}
            >
              {message.isSystemMessage ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-px flex-1 bg-border max-w-16" />
                  <span>{message.content}</span>
                  <div className="h-px flex-1 bg-border max-w-16" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium text-foreground">
                      {message.sender}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="mt-1 max-w-full">
                    <p className="text-xs sm:text-sm text-foreground bg-secondary rounded-lg p-2 sm:p-3 break-words">
                      {message.content}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 border-t border-border bg-card space-y-2"
      >
        <Input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-sm"
          maxLength={500}
        />
        <Button
          type="submit"
          disabled={!messageInput.trim()}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 sm:h-9 text-xs sm:text-sm"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
