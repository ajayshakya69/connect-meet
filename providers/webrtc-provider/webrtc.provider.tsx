"use client";
import { useEffect, useState } from "react";
import { WebRtcConext } from "./webrtc.context";
import { RemoteStream } from "./webrtc.types";

export function WebRTCProvider({ children }: { children: React.ReactNode }) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[] | null>(
    null,
  );

  // ✅ Properly typed states
  const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [answer, setAnswer] = useState<RTCSessionDescriptionInit | null>(null);

  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  async function getVideoStream() {
    try {
      if (!cameraOff && !isMuted) {
        setVideoStream(null);
        return;
      }

      const constraints = { video: cameraOff, audio: isMuted };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (peerConnection) {
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
      }

      setVideoStream(stream);
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
    console.log("offer created", { offerDesc });
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
      console.log("offer added and answer created ", { offer, answerDesc });
      setAnswer(answerDesc);
    } catch (err) {
      console.error("Error creating answer:", err);
    }
  }

  async function handleAnswer() {
    if (!peerConnection || !answer) return;
    try {
      const ansadded = await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
      console.log("anwer added", { ansadded });
    } catch (err) {
      console.error("Error handling answer:", err);
    }
  }

  // ✅ Create peer connection
  useEffect(() => {
    const configuration: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const connection = new RTCPeerConnection(configuration);

    connection.ontrack = (event) => {
      const stream = event.streams[0];

      console.log({ remotestream: stream });
      if (!stream) return;

      setRemoteStreams((prev) => {
        const id = stream.id;
        const alreadyAdded = prev?.some((r) => r.stream.id === id);
        if (alreadyAdded) return prev;
        return [...(prev || []), { participantId: id, stream }];
      });
    };

    connection.onconnectionstatechange = () => {
      console.log("Connection state changed:", connection.connectionState);
      if (connection.connectionState === "connected")
        console.log("✅ Peers connected!");
      if (connection.connectionState === "failed")
        console.warn("❌ ICE negotiation failed.");
    };

    setPeerConnection(connection);

    return () => {
      connection.close();
    };
  }, []);

  useEffect(() => {
    getVideoStream();
  }, [cameraOff, isMuted]);

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
