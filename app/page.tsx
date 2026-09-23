"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Phone, 
  Video, 
  PhoneOff, 
  Search, 
  MessageSquare, 
  Users, 
  Compass, 
  Plus, 
  ArrowLeft, 
  Mic, 
  MicOff,
  MoreVertical,
  CheckCheck
} from "lucide-react";

const CHATS = [
  { id: 1, name: "Sakib Al Hasan", message: "Kemon acho?", time: "10:45 AM", unread: 2, online: true },
  { id: 2, name: "Family Group", message: "Ammu: Basha koi tui?", time: "09:30 AM", unread: 0, online: false },
  { id: 3, name: "Rafiq (Work)", message: "File ta send koro", time: "Yesterday", unread: 0, online: true },
  { id: 4, name: "Tania", message: "Call me back urgently", time: "Yesterday", unread: 1, online: false },
  { id: 5, name: "Friend 1", message: "Video call diyo ektu pore", time: "Monday", unread: 0, online: true },
];

export default function ImoApp() {
  const [activeTab, setActiveTab] = useState("chats");
  const [inCall, setInCall] = useState(false);
  const [callingUser, setCallingUser] = useState<string | null>(null);
  const [micMuted, setMicMuted] = useState(false);

  const startCall = (name: string) => {
    setCallingUser(name);
    setInCall(true);
  };

  const endCall = () => {
    setInCall(false);
    setCallingUser(null);
  };

  if (inCall) {
    return (
      <div className="flex flex-col h-screen w-full bg-slate-900 text-white relative select-none">
        {/* Call Top Header */}
        <div className="flex items-center justify-between p-4 z-10 bg-gradient-to-b from-black/60 to-transparent">
          <button onClick={endCall} className="p-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="font-semibold text-lg">{callingUser}</h2>
            <p className="text-xs text-green-400 font-medium">imo HD Video Calling...</p>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Video Body */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="w-28 h-28 rounded-full bg-[#0088cc] flex items-center justify-center text-4xl font-bold border-4 border-white/20 animate-pulse">
            {callingUser?.[0] || "U"}
          </div>
          <p className="mt-4 text-slate-300 text-sm">Waiting for response...</p>

          {/* Self Preview Floating Window */}
          <div className="absolute top-4 right-4 w-28 h-40 bg-black/80 rounded-xl border-2 border-white/40 overflow-hidden shadow-2xl flex items-center justify-center">
            <span className="text-xs text-slate-400">My Video</span>
          </div>
        </div>

        {/* Call Controls */}
        <div className="p-8 flex items-center justify-around z-10 bg-gradient-to-t from-black/80 to-transparent">
          <button 
            onClick={() => setMicMuted(!micMuted)}
            className={`p-4 rounded-full transition shadow-lg ${micMuted ? "bg-red-500" : "bg-white/20 hover:bg-white/30"}`}
          >
            {micMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button 
            onClick={endCall}
            className="p-5 rounded-full bg-red-600 hover:bg-red-700 shadow-xl"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
          <button className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition shadow-lg">
            <Video className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans select-none">
      {/* IMO Top App Bar */}
      <div className="bg-[#0088cc] text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#0088cc] flex items-center justify-center font-bold text-xl border border-white">
              i
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">imo</h1>
              <p className="text-[11px] text-blue-100 font-light">Free Video Calls & Chat</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-white/10 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story / Active Contacts Bar */}
        <div className="flex items-center space-x-4 mt-4 pb-1 overflow-x-auto no-scrollbar">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/60 flex items-center justify-center bg-white/10">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] mt-1 text-blue-100">My Story</span>
          </div>
          {CHATS.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => startCall(chat.name)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-green-400 flex items-center justify-center font-bold text-lg text-white">
                  {chat.name[0]}
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0088cc]"></span>
                )}
              </div>
              <span className="text-[11px] mt-1 text-white truncate w-14 text-center">{chat.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat List */}
      <div className="flex-1 overflow-y-auto bg-white divide-y divide-slate-100">
        {CHATS.map((chat) => (
          <div 
            key={chat.id}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#e8f4fc] text-[#0088cc] flex items-center justify-center font-bold text-lg border border-blue-100">
                  {chat.name[0]}
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm truncate">{chat.name}</h3>
                  <span className="text-[11px] text-slate-400">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span>{chat.message}</span>
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-[#0088cc] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Call Actions */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-100">
              <button 
                onClick={() => startCall(chat.name)}
                className="p-2 text-[#0088cc] hover:bg-blue-50 rounded-full transition"
                title="Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button 
                onClick={() => startCall(chat.name)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* IMO Bottom Navigation Bar */}
      <div className="bg-white border-t border-slate-200 py-2 px-6 flex justify-around items-center text-slate-500 shadow-inner">
        <button 
          onClick={() => setActiveTab("chats")}
          className={`flex flex-col items-center ${activeTab === "chats" ? "text-[#0088cc]" : "text-slate-400"}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Chats</span>
        </button>
        <button 
          onClick={() => setActiveTab("contacts")}
          className={`flex flex-col items-center ${activeTab === "contacts" ? "text-[#0088cc]" : "text-slate-400"}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Contacts</span>
        </button>
        <button 
          onClick={() => setActiveTab("explore")}
          className={`flex flex-col items-center ${activeTab === "explore" ? "text-[#0088cc]" : "text-slate-400"}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Explore</span>
        </button>
      </div>
    </div>
  );
}
