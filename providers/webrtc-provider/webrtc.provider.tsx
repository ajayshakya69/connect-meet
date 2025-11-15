"use client";

import { useEffect, useState } from "react";
import { WebRtcConext } from "./webrtc.context";

export function WebRTCProvider({ children }: { children: React.ReactNode }) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream | null>(null);
  const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [answer, setAnswer] = useState<RTCSessionDescriptionInit | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [cameraOff, setCameraOff] = useState(true);

  // -------------------------------
  //   GET USER MEDIA ONCE ONLY
  // -------------------------------
  async function getVideoStream() {
    try {
      const constraints = { video: true, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setVideoStream(stream);

      const pc = await startPeerConnection();
      if (pc) {
        console.log("peer connection made");
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      }

      return stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  }

  // -------------------------------
  //   INIT PEER CONNECTION
  // -------------------------------

  // -------------------------------
  // CREATE OFFER
  // -------------------------------
  async function createOffer() {
    if (!peerConnection) return;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(
          "New offer with ICE candidate ",
          peerConnection.localDescription,
        );

        setOffer(peerConnection.localDescription);
      }
    };

    const offerDesc = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerDesc);
  }

  // -------------------------------
  // CREATE ANSWER
  // -------------------------------
  async function createAnswer() {
    if (!peerConnection || !offer) return;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(
          "New ICE candidate answer",
          peerConnection.localDescription,
        );

        setAnswer(peerConnection.localDescription);
      }
    };

    await peerConnection.setRemoteDescription(offer);
    const answerDesc = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerDesc);
  }

  // -------------------------------
  // HANDLE ANSWER
  // -------------------------------
  async function handleAnswer() {
    if (!peerConnection || !answer) return;

    await peerConnection.setRemoteDescription(answer);
  }

  // -------------------------------
  // GET MEDIA ONCE (not twice)
  // -------------------------------
  useEffect(() => {
    getVideoStream();
  }, []);

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

    // Receive remote tracks
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      console.log("REMOTE STREAM RECEIVED", stream);
      setRemoteStreams(stream);
    };

    setPeerConnection(pc);
    return pc;
  }

  return (
    <WebRtcConext.Provider
      value={{
        offer,
        setOffer,
        answer,
        setAnswer,
        createOffer,
        createAnswer,
        handleAnswer,
        remoteStreams,
        videoStream,
        isMuted,
        cameraOff,
        toggleVideo: () => setCameraOff((v) => !v),
        toggleAudio: () => setIsMuted((v) => !v),
      }}
    >
      {children}
    </WebRtcConext.Provider>
  );
}
