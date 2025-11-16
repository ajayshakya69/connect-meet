// A single remote participant's stream
export interface RemoteStream {
  participantId: string;
  stream: MediaStream;
}

// Meeting data stored inside provider
export type MeetingData = {
  meetingId: string;
  userName: string;
  isCreator: boolean;
} | null;

// Complete typed context
export type WebRTCContextType = {
  videoStream: MediaStream | null;
  remoteStreams: MediaStream | null;

  offer: RTCSessionDescriptionInit | null;
  answer: RTCSessionDescriptionInit | null;

  createOffer: () => Promise<void>;
  createAnswer: () => Promise<void>;
  handleAnswer: () => Promise<void>;

  cameraOff: boolean;
  isMuted: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;

  setOffer: React.Dispatch<
    React.SetStateAction<RTCSessionDescriptionInit | null>
  >;
  setAnswer: React.Dispatch<
    React.SetStateAction<RTCSessionDescriptionInit | null>
  >;

  peerConnection: RTCPeerConnection | null;

  // NEW — meeting flow states
  currentPage: "landing" | "meeting";
  meetingData: MeetingData;

  handleStartMeeting: () => void;
  handleJoinMeeting: (meetingId: string) => void;
  handleLeaveMeeting: () => void;
};
