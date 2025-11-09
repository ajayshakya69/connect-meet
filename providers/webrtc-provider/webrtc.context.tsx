import { createContext } from "react";
import { WebRTCContextType } from "./webrtc.types";

export const WebRtcConext = createContext<WebRTCContextType | null>(null);
