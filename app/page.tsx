"use client";

import { useState } from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { Phone, Video, PhoneOff, User, MessageSquare } from "lucide-react";

const APP_ID = "আপনার_AGORA_APP_ID"; 

export default function MobileImo() {
  const [inCall, setInCall] = useState(false);
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);

  const startCall = async () => {
    const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    setClient(agoraClient);

    agoraClient.on("user-published", async (user, mediaType) => {
      await agoraClient.subscribe(user, mediaType);
      if (mediaType === "video") {
        user.videoTrack?.play("remote-screen");
      }
      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    });

    await agoraClient.join(APP_ID, "main-channel", null, null);
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    const videoTrack = await AgoraRTC.createCameraVideoTrack();

    videoTrack.play("local-screen");
    await agoraClient.publish([audioTrack, videoTrack]);
    setInCall(true);
  };

  const endCall = async () => {
    if (client) await client.leave();
    setInCall(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white max-w-md mx-auto">
      <div className="p-4 bg-sky-600 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-wide">imo Clone</h1>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">U</div>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-center items-center relative">
        {inCall ? (
          <div className="w-full h-full relative rounded-2xl overflow-hidden bg-black flex flex-col justify-end p-4">
            <div id="remote-screen" className="absolute inset-0 w-full h-full" />
            <div id="local-screen" className="absolute top-4 right-4 w-28 h-40 bg-slate-800 rounded-xl border border-white/20 z-10" />
            <button onClick={endCall} className="z-20 self-center bg-red-600 p-4 rounded-full shadow-lg">
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center font-bold text-lg">F</div>
                <div>
                  <h3 className="font-semibold text-base">Friend 1</h3>
                  <p className="text-xs text-green-400">Online</p>
                </div>
              </div>
              <button onClick={startCall} className="p-3 bg-sky-600 hover:bg-sky-500 rounded-full">
                <Video className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-800 border-t border-slate-700 p-3 flex justify-around items-center">
        <button className="flex flex-col items-center text-sky-400 text-xs">
          <MessageSquare className="w-5 h-5" />
          <span>Chats</span>
        </button>
        <button className="flex flex-col items-center text-gray-400 text-xs">
          <Phone className="w-5 h-5" />
          <span>Calls</span>
        </button>
        <button className="flex flex-col items-center text-gray-400 text-xs">
          <User className="w-5 h-5" />
          <span>Contacts</span>
        </button>
      </div>
    </div>
  );
}
