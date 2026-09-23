"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Phone, 
  Video, 
  PhoneOff, 
  Search, 
  Plus, 
  ArrowLeft, 
  Mic, 
  MicOff,
  MoreVertical,
  Smile,
  Image as ImageIcon,
  Send,
  BellOff,
  CheckCheck
} from "lucide-react";

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

interface Contact {
  id: string;
  name: string;
  sub: string;
  time: string;
  unread?: number;
  online?: boolean;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: "1", name: "My Life", sub: "আল্লাহ সব জানেন , অবশ্যই আল্লাহ সময় ম...", time: "Yesterday", online: true },
  { id: "2", name: "Baba Gp", sub: "Tap to view", time: "8:50 am", online: true },
  { id: "3", name: "Fatema Apa", sub: "Tap to view", time: "Yesterday", unread: 3, online: true },
  { id: "4", name: "Rahima Gp", sub: "Audio call", time: "Yesterday", online: false },
  { id: "5", name: "Popi", sub: "Audio call", time: "Yesterday", online: true },
  { id: "6", name: "আমেনা আপা", sub: "Tap to view", time: "Yesterday", unread: 2, online: false },
  { id: "7", name: "Ruma Apa", sub: "Audio call", time: "Sat", online: true },
];

export default function ImoDarkApp() {
  const [activeChat, setActiveChat] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    "2": [
      { id: "m1", sender: "them", text: "Kemon acho?", time: "8:48 am" },
      { id: "m2", sender: "me", text: "Alhamdulillah bhalo, tumi?", time: "8:49 am" }
    ]
  });
  const [inputVal, setInputVal] = useState("");
  const [inCall, setInCall] = useState<"audio" | "video" | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeChat) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    setInputVal("");
  };

  // Video/Audio Call Screen
  if (inCall && activeChat) {
    return (
      <div className="flex flex-col h-screen w-full bg-[#121212] text-white select-none max-w-md mx-auto">
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={() => setInCall(null)} className="p-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="font-semibold text-lg">{activeChat.name}</h2>
            <p className="text-xs text-green-400">{inCall === "video" ? "imo HD Video Calling..." : "imo Voice Calling..."}</p>
          </div>
          <div className="w-8"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="w-28 h-28 rounded-full bg-[#20242a] border-2 border-cyan-500/40 flex items-center justify-center text-3xl font-bold text-cyan-400 animate-pulse shadow-2xl">
            {activeChat.name[0]}
          </div>
          <p className="mt-4 text-xs text-neutral-400">Ringing...</p>
        </div>

        <div className="p-8 flex items-center justify-around bg-[#181a1e] rounded-t-3xl border-t border-neutral-800">
          <button 
            onClick={() => setMicMuted(!micMuted)} 
            className={`p-4 rounded-full ${micMuted ? "bg-red-500" : "bg-neutral-800"}`}
          >
            {micMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button 
            onClick={() => setInCall(null)} 
            className="p-5 rounded-full bg-red-600 hover:bg-red-700 shadow-xl"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
          <button 
            onClick={() => setInCall(inCall === "video" ? "audio" : "video")} 
            className="p-4 rounded-full bg-neutral-800"
          >
            <Video className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    );
  }

  // Inside Chat Room (Screenshot 2)
  if (activeChat) {
    const currentChatMsgs = messages[activeChat.id] || [];

    return (
      <div className="flex flex-col h-screen w-full bg-[#181a1d] text-white select-none max-w-md mx-auto">
        {/* Chat Top Header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-neutral-800 bg-[#1f2227]">
          <div className="flex items-center space-x-2">
            <button onClick={() => setActiveChat(null)} className="p-1 text-neutral-300">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-medium text-sm text-neutral-100">{activeChat.name}</h2>
                <BellOff className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <p className="text-[11px] text-neutral-400">Online</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-cyan-400">
            <button onClick={() => setInCall("audio")} className="p-1 hover:text-cyan-300">
              <Phone className="w-5 h-5 fill-cyan-400" />
            </button>
            <button onClick={() => setInCall("video")} className="p-1 hover:text-cyan-300">
              <Video className="w-5 h-5 fill-cyan-400" />
            </button>
            <button className="p-1 text-neutral-300">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex justify-center">
            <span className="text-[11px] bg-[#24272e] text-neutral-400 px-3 py-1 rounded-full border border-neutral-700/50">
              Tap to load history
            </span>
          </div>

          {currentChatMsgs.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}
            >
              <div 
                className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                  msg.sender === "me" 
                    ? "bg-[#0088cc] text-white rounded-tr-none" 
                    : "bg-[#282c34] text-neutral-100 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-neutral-500 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Emoji Reaction Bar (As seen in screenshot) */}
        <div className="px-3 py-1.5 flex items-center justify-between text-lg bg-[#1a1d21] border-t border-neutral-800/80">
          <span>💎</span>
          <span>😡</span>
          <span>👨‍✈️</span>
          <span>💋</span>
          <span>🌹</span>
          <span>❤️</span>
          <span>😭</span>
          <span>😆</span>
        </div>

        {/* Message Input Bottom Bar */}
        <form onSubmit={handleSendMessage} className="p-2 bg-[#1a1d21] flex items-center space-x-2">
          <div className="flex items-center bg-[#252830] rounded-full flex-1 px-3 py-1.5">
            <Smile className="w-5 h-5 text-neutral-400 mr-2 cursor-pointer" />
            <input 
              type="text"
              placeholder="Message"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none flex-1 placeholder-neutral-500"
            />
            <ImageIcon className="w-5 h-5 text-neutral-400 ml-2 cursor-pointer" />
            <Plus className="w-5 h-5 text-neutral-400 ml-2 cursor-pointer" />
          </div>

          {inputVal.trim() ? (
            <button type="submit" className="p-2.5 rounded-full bg-[#0088cc] text-white shadow">
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" className="p-2.5 rounded-full bg-[#0095ff] text-white shadow">
              <Mic className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>
    );
  }

  // Imo Main Home Screen - Dark Mode (Screenshot 1)
  return (
    <div className="flex flex-col h-screen w-full bg-[#17181c] text-white select-none max-w-md mx-auto">
      {/* Topimo Navbar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 bg-[#1f2126] border-b border-neutral-800">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-[#343842] border border-cyan-400/40 flex items-center justify-center font-bold text-xs">
            H
          </div>
        </div>

        <div className="relative cursor-pointer">
          <div className="w-7 h-7 flex items-center justify-center text-cyan-400">
            <svg className="w-6 h-6 fill-cyan-400" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 bg-green-500 text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            8
          </span>
          <div className="w-10 h-0.5 bg-cyan-400 mx-auto mt-1.5 rounded-full"></div>
        </div>

        <div className="cursor-pointer text-neutral-400 hover:text-white">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        </div>
      </div>

      {/* Story Bubbles Row */}
      <div className="flex items-center space-x-4 px-3 py-3 overflow-x-auto bg-[#17181c] no-scrollbar border-b border-neutral-800/60">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#292c34] flex items-center justify-center relative border border-neutral-700">
            <svg className="w-5 h-5 text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M9 2L7.17 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-3.17L15 2H9z" />
            </svg>
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center text-black text-xs font-bold leading-none">+</span>
          </div>
          <span className="text-[11px] text-neutral-400 mt-1">Story</span>
        </div>

        {["রবিন", "Kadir Bodai", "Planet", "Marketpla.."].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center flex-shrink-0">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[#2a2e38] border-2 border-green-500/80 flex items-center justify-center font-bold text-sm text-cyan-300">
                {item[0]}
              </div>
              <span className="absolute -top-1 -right-1 bg-green-500 text-black text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-black">
                1
              </span>
            </div>
            <span className="text-[11px] text-neutral-300 mt-1 truncate w-14 text-center">{item}</span>
          </div>
        ))}
      </div>

      {/* Main Chat List */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60 bg-[#17181c]">
        {INITIAL_CONTACTS.map((c) => (
          <div 
            key={c.id} 
            onClick={() => setActiveChat(c)}
            className="flex items-center justify-between px-3.5 py-3 hover:bg-[#1f2228] transition cursor-pointer"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#272b34] text-cyan-400 flex items-center justify-center font-bold text-base border border-neutral-700">
                  {c.name[0]}
                </div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#17181c]"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-100 text-sm truncate">{c.name}</h3>
                  <span className="text-[10px] text-neutral-500">{c.time}</span>
                </div>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{c.sub}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pl-3">
              {c.unread ? (
                <span className="bg-green-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {c.unread}
                </span>
              ) : null}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveChat(c);
                  setInCall("audio");
                }}
                className="p-1 text-cyan-400 hover:text-cyan-300"
              >
                <Phone className="w-5 h-5 fill-cyan-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Floating Bar */}
      <div className="p-3 bg-[#17181c] flex items-center justify-between px-6 border-t border-neutral-800">
        <button className="text-cyan-400 text-xl font-bold">
          <Plus className="w-6 h-6" />
        </button>
        <button className="text-cyan-400">
          <Search className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
