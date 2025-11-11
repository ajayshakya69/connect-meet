"use client";
import { useEffect, useState } from "react";
import { WebRtcConext } from "./webrtc.context";
import { RemoteStream } from "./webrtc.types";
import { connection } from "next/server";

export function WebRTCProvider({ children }: { children: React.ReactNode }) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream | null>(null);
  const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [answer, setAnswer] = useState<RTCSessionDescriptionInit | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [cameraOff, setCameraOff] = useState(true);

  // ✅ Get user media (always adds tracks when peerConnection is ready)
  async function getVideoStream(connection?: RTCPeerConnection) {
    try {
      const constraints = { video: true, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setVideoStream(stream);

      // If peer connection available, add tracks
      if (connection) {
        stream.getTracks().forEach((track) => {
          connection.addTrack(track, stream);
        });
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  }

  const toggleVideo = () => setCameraOff((prev) => !prev);
  const toggleAudio = () => setIsMuted((prev) => !prev);

  async function createOffer() {
    if (!peerConnection) return;
    const offerDesc = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerDesc);
    console.log("📤 Offer created:", offerDesc);
    setOffer(offerDesc);
  }

  async function createAnswer() {
    if (!peerConnection || !offer) return;
    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      const answerDesc = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answerDesc);
      console.log("📩 Answer created:", answerDesc);
      setAnswer(answerDesc);
    } catch (err) {
      console.error("Error creating answer:", err);
    }
  }

  async function handleAnswer() {
    if (!peerConnection || !answer) return;
    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
      console.log("✅ Answer applied:", answer);
    } catch (err) {
      console.error("Error handling answer:", err);
    }
  }

  useEffect(() => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.relay.metered.ca:80" },
        {
          urls: "turn:global.relay.metered.ca:443?transport=tcp",
          username: "2ad699eea1f2f61b1f11958b",
          credential: "5tcqmBTXblTRGu/p",
        },
      ],
    };

    const connection = new RTCPeerConnection(configuration);

    connection.ontrack = (event) => {
      const stream = event.streams[0];
      console.log({ remotestream: stream });
      if (!stream) return;
      setRemoteStreams(stream);
    };

    connection.onconnectionstatechange = () => {
      console.log("🔁 Connection state:", connection.connectionState);
      if (connection.connectionState === "connected")
        console.log("✅ Peers connected!");
      if (connection.connectionState === "failed")
        console.warn("❌ ICE negotiation failed.");
    };

    setPeerConnection(connection);

    // ✅ Wait a moment so peerConnection is definitely set
    getVideoStream(connection);

    return () => connection.close();
  }, []);

  useEffect(() => {
    getVideoStream();
  }, [connection]);

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
        toggleVideo,
        toggleAudio,
      }}
    >
      {children}
    </WebRtcConext.Provider>
  );
}
