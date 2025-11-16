"use client";

import { useEffect, useState } from "react";
import { WebRtcConext } from "./webrtc.context";
import { WebRTCContextType, MeetingData } from "./webrtc.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "../socketProvider/socket.hook";

export function WebRTCProvider({ children }: { children: React.ReactNode }) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  const router = useRouter();
  const params = useSearchParams();
  const meetingId = params.get("meeting_id");

  const { socket } = useSocket();

  const [currentPage, setCurrentPage] = useState<"landing" | "meeting">(
    "landing",
  );
  const [meetingData, setMeetingData] = useState<MeetingData>(null);

  // ---------------------------
  // CREATE RTCPeerConnection
  // ---------------------------
  const createPeerConnection = () => {
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
      console.log("📡 Remote stream received");
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: meetingId,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", pc.connectionState);
    };

    setPeerConnection(pc);
    return pc;
  };

  // ---------------------------
  // GET USER MEDIA + INIT PC
  // ---------------------------
  const startMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setVideoStream(stream);

    const pc = createPeerConnection();

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    return pc;
  };

  // ---------------------------
  // CREATE OFFER (creator)
  // ---------------------------
  const createOffer = async () => {
    console.log("ajay create offer", { peerConnection, socket });
    if (!peerConnection || !socket) return;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("webrtc-offer", {
      offer,
      to: meetingId,
    });
  };

  // ---------------------------
  // CREATE ANSWER (guest)
  // ---------------------------
  const answerOffer = async (
    offer: RTCSessionDescriptionInit,
    from: string,
  ) => {
    const pc = peerConnection;

    console.log("ajay Answer offer", { pc, socket });
    if (!pc || !socket) return;

    await pc.setRemoteDescription(offer);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("webrtc-answer", { answer, to: from });
  };

  // ---------------------------
  // HANDLE RECEIVED ANSWER
  // ---------------------------
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    console.log("ajay Handle answer", { peerConnection });
    if (!peerConnection) return;
    await peerConnection.setRemoteDescription(answer);
  };

  // =====================================================
  // SOCKET HANDLERS
  // =====================================================

  useEffect(() => {
    if (!socket) return;

    socket.on("user-joined", async ({ userId }) => {
      console.log("👤 User joined:", userId);
      await createOffer();
    });

    socket.on("webrtc-offer", async ({ offer, from }) => {
      console.log("📨 Offer received");
      await answerOffer(offer, from);
    });

    socket.on("webrtc-answer", async ({ answer }) => {
      console.log("📨 Answer received");
      await handleAnswer(answer);
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (peerConnection && candidate) {
        try {
          await peerConnection.addIceCandidate(candidate);
        } catch (e) {
          console.error("❌ Error adding ICE candidate", e);
        }
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("ice-candidate");
    };
  }, [socket, peerConnection]);

  // =====================================================
  // MEETING FLOW
  // =====================================================

  const handleStartMeeting = async () => {
    console.log("ajay handle start meeting", { socket });
    if (!socket) return;
    router.push(`?meeting_id=${socket.id}`);

    setCurrentPage("meeting");

    setMeetingData({
      meetingId: socket.id!,
      userName: "Host",
      isCreator: true,
    });

    const pc = await startMedia();

    socket.emit("join-or-create-meeting", { meetingId: socket.id });
  };

  const handleJoinMeeting = async () => {
    router.push(`?meeting_id=${meetingId}`);

    console.log("ajay handle join meeting", { meetingId, socket });
    if (!meetingId || !socket) return;

    setCurrentPage("meeting");

    setMeetingData({
      meetingId,
      userName: "Guest",
      isCreator: false,
    });

    const pc = await startMedia();

    socket.emit("join-or-create-meeting", { meetingId });
  };

  // AUTO JOIN WHEN URL HAS MEETING ID
  useEffect(() => {
    if (!socket || !meetingId) return;

    console.log("🔗 Auto-joining meeting from shared URL:", meetingId);

    setCurrentPage("meeting");

    setMeetingData({
      meetingId,
      userName: "Guest",
      isCreator: false,
    });

    (async () => {
      await startMedia();
      socket.emit("join-or-create-meeting", { meetingId });
    })();
  }, [socket, meetingId]);

  const value: WebRTCContextType = {
    videoStream,
    remoteStreams: remoteStream,

    peerConnection,
    meetingData,
    currentPage,

    handleStartMeeting,
    handleJoinMeeting,
  };

  return (
    <WebRtcConext.Provider value={value}>{children}</WebRtcConext.Provider>
  );
}
