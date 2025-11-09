export type WebRTCContextType = {
  videoStream: MediaStream | null;
  remoteStreams: RemoteStream[] | null;

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
};

export interface RemoteStream {
  participantId: string;
  stream: MediaStream;
}
