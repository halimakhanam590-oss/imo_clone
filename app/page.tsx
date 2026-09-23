"use client";

import React, { useState, useEffect, useRef } from "react";
import { Video, PhoneOff, User } from "lucide-react";

const APP_ID = "YOUR_AGORA_APP_ID";

export default function ImoPage() {
  const [joined, setJoined] = useState(false);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let agoraClient: any = null;
    const init = async () => {
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
      agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(agoraClient);

      agoraClient.on("user-published", async (user: any, mediaType: "audio" | "video") => {
        await agoraClient.subscribe(user, mediaType);
        if (mediaType === "video") {
          const remoteTrack = user.videoTrack;
          if (remoteVideoRef.current) {
            remoteTrack.play(remoteVideoRef.current);
          }
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });
    };
    init();

    return () => {
      if (agoraClient) {
        agoraClient.leave();
      }
    };
  }, []);

  const joinChannel = async () => {
    if (!client) return;
    const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
    await client.join(APP_ID, "main-channel", null, null);
    const audio = await AgoraRTC.createMicrophoneAudioTrack();
    const video = await AgoraRTC.createCameraVideoTrack();
    setLocalAudioTrack(audio);
    setLocalVideoTrack(video);

    if (localVideoRef.current) {
      video.play(localVideoRef.current);
    }
    await client.publish([audio, video]);
    setJoined(true);
  };

  const leaveChannel = async () => {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    if (client) {
      await client.leave();
    }
    setJoined(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 border shadow-lg">
      {/* IMO Header */}
      <div className="bg-[#0088cc] text-white p-4 flex items-center justify-between shadow">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight">Friend 1</h1>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> Online
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {!joined ? (
            <button
              onClick={joinChannel}
              className="bg-green-500 hover:bg-green-600 p-2.5 rounded-full text-white shadow"
            >
              <Video className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={leaveChannel}
              className="bg-red-500 hover:bg-red-600 p-2.5 rounded-full text-white shadow"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 bg-neutral-900 relative flex flex-col items-center justify-center">
        <div ref={remoteVideoRef} className="w-full h-full absolute inset-0 flex items-center justify-center">
          {!joined && <p className="text-gray-400 text-sm">কল শুরু করতে উপরের ভিডিও বাটনে চাপুন</p>}
        </div>
        {joined && (
          <div
            ref={localVideoRef}
            className="absolute top-4 right-4 w-28 h-40 bg-black rounded-lg border-2 border-white overflow-hidden shadow-lg z-10"
          />
        )}
      </div>
    </div>
  );
}
