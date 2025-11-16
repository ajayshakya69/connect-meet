"use client";

import { useEffect, useState } from "react";
import { WebRtcConext } from "./webrtc.context";
import { RemoteStream, WebRTCContextType, MeetingData } from "./webrtc.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "../socketProvider/socket.hook";

export function WebRTCProvider({ children }: { children: React.ReactNode }) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream | null>(null);

  const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [answer, setAnswer] = useState<RTCSessionDescriptionInit | null>(null);

  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const params = useSearchParams();
  const meetingId = params.get("meeting_id");

  const router = useRouter();

  const { socket } = useSocket();

  const [currentPage, setCurrentPage] = useState<"landing" | "meeting">(
    "landing",
  );

  const [meetingData, setMeetingData] = useState<MeetingData>(null);

  const handleStartMeeting = async () => {
    if (!socket) return;
    router.push(`?meeting_id=${socket.id}`);
    setCurrentPage("meeting");
    setMeetingData({
      meetingId: socket ? socket.id! : "",
      userName: "Host",
      isCreator: true,
    });
  };

  const handleJoinMeeting = async () => {
    router.push(`?meeting_id=${meetingId}`);
    setCurrentPage("meeting");
    setMeetingData({
      meetingId: meetingId || "",
      userName: "Guest",
      isCreator: false,
    });
  };

  const handleLeaveMeeting = () => {
    setCurrentPage("landing");
    setMeetingData(null);
  };

  async function startPeerConnection() {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.relay.metered.ca:80" },
        {
          urls: "turn:global.relay.metered.ca:443?transport=tcp",
          username: "2ad699eea1f2f61b1f11958b",
          credential: "5tcqmBTXblTRGu/p",
        },
      ],
    });
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      console.log("REMOTE STREAM RECEIVED", stream);
      setRemoteStreams(stream);
    };
    setPeerConnection(pc);
    return pc;
  }
  // ------------------------------------
  //        GET USER MEDIA
  // ------------------------------------
  async function getVideoStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setVideoStream(stream);

      const pc = await startPeerConnection();
      if (pc) {
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  }

  useEffect(() => {
    if (currentPage !== "meeting") return;
    getVideoStream();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(meetingId ? "meeting" : "landing");
  }, [meetingId]);

  async function createOffer() {
    if (!peerConnection) return;

    peerConnection.onicecandidate = () =>
      setOffer(peerConnection.localDescription);

    const offerDesc = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerDesc);
  }

  async function createAnswer() {
    if (!peerConnection || !offer) return;

    peerConnection.onicecandidate = () =>
      setAnswer(peerConnection.localDescription);

    await peerConnection.setRemoteDescription(offer);

    const answerDesc = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerDesc);
  }

  async function handleAnswer() {
    if (!peerConnection || !answer) return;
    await peerConnection.setRemoteDescription(answer);
  }

  const value: WebRTCContextType = {
    videoStream,
    remoteStreams,

    offer,
    answer,

    createOffer,
    createAnswer,
    handleAnswer,

    cameraOff,
    isMuted,
    toggleVideo: () => setCameraOff((v) => !v),
    toggleAudio: () => setIsMuted((v) => !v),

    setOffer,
    setAnswer,

    peerConnection,

    currentPage,
    meetingData,
    handleStartMeeting,
    handleJoinMeeting,
    handleLeaveMeeting,
  };

  return (
    <WebRtcConext.Provider value={value}>{children}</WebRtcConext.Provider>
  );
}
