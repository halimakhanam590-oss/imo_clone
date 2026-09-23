"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Phone, Video, PhoneOff, Search, Plus, ArrowLeft, Mic, MicOff, 
  MoreVertical, Smile, Image as ImageIcon, Send, Bell, Globe, X, 
  UserPlus, ShieldCheck, Smartphone, MessageCircle, DollarSign
} from "lucide-react";

const COUNTRY_CODES = [
  { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+1", name: "USA / Canada", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" }
];

const EMOJI_LIST = ["💎", "😡", "👨‍✈️", "💋", "🌹", "❤️", "😭", "😆", "🔥", "👍"];

export default function CallerXApp() {
  const [step, setStep] = useState("email");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("+880");
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputVal, setInputVal] = useState("");
  const [inCall, setInCall] = useState(null);
  const [micMuted, setMicMuted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCountry, setNewCountry] = useState("+880");
  const chatBottomRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("callerx_contacts");
    if (saved) {
      try { setContacts(JSON.parse(saved)); } catch (e) {}
    } else {
      const def = [
        { id: "1", name: "Caller X Support", phone: "+1 800 123 456", time: "Now", online: true },
        { id: "2", name: "Premium Client Care", phone: "+880 1700-000000", time: "8:50 am", online: true }
      ];
      setContacts(def);
      localStorage.setItem("callerx_contacts", JSON.stringify(def));
    }
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  const handleGrantPermissions = async () => {
    if ("Notification" in window) {
      try { await Notification.requestPermission(); } catch (e) {}
    }
    if ("contacts" in navigator && "ContactsManager" in window) {
      try {
        const sel = await (navigator as any).contacts.select(["name", "tel"], { multiple: true });
        if (sel && sel.length > 0) {
          const fmt = sel.map((c: any, i: number) => ({
            id: Date.now() + "-" + i,
            name: c.name?.[0] || "Client",
            phone: c.tel?.[0] || "",
            time: "Just now",
            online: true
          }));
          const m = [...fmt, ...contacts];
          setContacts(m);
          localStorage.setItem("callerx_contacts", JSON.stringify(m));
        }
      } catch (err) {}
    }
    setStep("app");
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    const item = {
      id: Date.now().toString(),
      name: newName.trim(),
      phone: `${newCountry} ${newPhone.trim()}`,
      time: "Just now",
      online: true
    };
    const upd = [item, ...contacts];
    setContacts(upd);
    localStorage.setItem("callerx_contacts", JSON.stringify(upd));
    setNewName(""); setNewPhone(""); setShowAddModal(false);
  };

  const sendMessage = (txt: string) => {
    if (!txt.trim() || !activeChat) return;
    const m = {
      id: Date.now().toString(),
      sender: "me",
      text: txt.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages((prev: any) => ({ ...prev, [activeChat.id]: [...(prev[activeChat.id] || []), m] }));
    setInputVal("");
  };

  if (step === "email") {
    return (
      <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-800 max-w-md mx-auto p-6 justify-between select-none">
        <div className="flex flex-col items-center mt-10">
          <div className="w-16 h-16 rounded-2xl bg-[#0088cc] flex items-center justify-center text-white text-3xl font-extrabold shadow-md mb-3">X</div>
          <h1 className="text-2xl font-bold tracking-tight">Caller X</h1>
          <p className="text-xs text-slate-500 mt-1">Client Login & Worldwide Communications</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (userEmail.trim()) setStep("phone_verify"); }} className="w-full space-y-4 my-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Client Google Email</label>
            <input type="email" required placeholder="client@gmail.com" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0088cc]" />
          </div>
          <button type="submit" className="w-full bg-[#0088cc] text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-600 transition shadow">Continue with Email</button>
        </form>
        <p className="text-[11px] text-center text-slate-400 mb-4">Encrypted worldwide client connection</p>
      </div>
    );
  }

  if (step === "phone_verify") {
    return (
      <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-800 max-w-md mx-auto p-6 justify-between select-none">
        <div className="flex items-center space-x-3 mt-4">
          <button onClick={() => setStep("email")} className="p-1 text-slate-600"><ArrowLeft className="w-6 h-6" /></button>
          <h2 className="font-bold text-lg">Verify Phone Number</h2>
        </div>
        <div className="w-full space-y-4 my-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Country</label>
            <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0088cc]">
              {COUNTRY_CODES.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.name} ({item.code})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Phone Number</label>
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5">
              <span className="text-sm font-medium text-slate-600 mr-2">{selectedCountry}</span>
              <input type="tel" required placeholder="1XXXXXXXXX" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} className="w-full bg-transparent text-sm focus:outline-none" />
            </div>
          </div>
          {!generatedOtp ? (
            <button type="button" onClick={() => { if (!userPhone.trim()) return; const r = Math.floor(1000 + Math.random() * 9000).toString(); setGeneratedOtp(r); alert("OTP: " + r); }} className="w-full bg-[#0088cc] text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-600 transition shadow">Get Verification Code</button>
          ) : (
            <div className="space-y-3 pt-2">
              <input type="text" maxLength={4} placeholder="e.g. 1234" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-center text-lg tracking-widest font-bold focus:outline-none focus:border-[#0088cc]" />
              <button type="button" onClick={() => { if (otpCode === generatedOtp || otpCode === "1234") setStep("permissions"); else alert("Invalid code! Try 1234"); }} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition shadow">Verify & Continue</button>
            </div>
          )}
        </div>
        <div className="text-center text-xs text-slate-400 mb-4">Caller X Carrier Network Active</div>
      </div>
    );
  }

  if (step === "permissions") {
    return (
      <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-800 max-w-md mx-auto p-6 justify-between select-none">
        <div className="flex flex-col items-center mt-8 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-[#0088cc] flex items-center justify-center mb-4 shadow-sm"><ShieldCheck className="w-10 h-10" /></div>
          <h2 className="text-xl font-bold text-slate-800">Permissions Required</h2>
          <p className="text-xs text-slate-500 mt-2 px-4">Caller X needs contacts access and notification permissions to alert incoming calls.</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-50 text-[#0088cc] rounded-lg"><Smartphone className="w-5 h-5" /></div>
            <div><h4 className="text-sm font-semibold">Contacts Access</h4><p className="text-xs text-slate-500">Sync international phonebooks.</p></div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-50 text-[#0088cc] rounded-lg"><Bell className="w-5 h-5" /></div>
            <div><h4 className="text-sm font-semibold">Notifications</h4><p className="text-xs text-slate-500">Alerts when clients call or chat.</p></div>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <button onClick={handleGrantPermissions} className="w-full bg-[#0088cc] text-white py-3.5 rounded-xl font-semibold text-sm shadow hover:bg-blue-600 transition">Allow All Permissions</button>
          <button onClick={() => setStep("app")} className="w-full bg-slate-200 text-slate-600 py-3 rounded-xl font-semibold text-sm hover:bg-slate-300 transition">Skip for now</button>
        </div>
      </div>
    );
  }

  if (inCall && activeChat) {
    return (
      <div className="flex flex-col h-screen w-full bg-slate-900 text-white select-none max-w-md mx-auto">
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={() => setInCall(null)} className="p-2 rounded-full hover:bg-white/10"><ArrowLeft className="w-6 h-6" /></button>
          <div className="text-center"><h2 className="font-semibold text-lg">{activeChat.name}</h2><p className="text-xs text-slate-300">{activeChat.phone}</p><p className="text-xs text-green-400 mt-0.5">Caller X Calling...</p></div>
          <div className="w-8"></div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-[#0088cc] flex items-center justify-center text-3xl font-bold animate-pulse shadow-2xl">{activeChat.name[0]}</div>
          <p className="mt-4 text-xs text-slate-400">Ringing internationally...</p>
        </div>
        <div className="p-8 flex items-center justify-around bg-slate-800 rounded-t-3xl border-t border-slate-700">
          <button onClick={() => setMicMuted(!micMuted)} className={`p-4 rounded-full ${micMuted ? "bg-red-500" : "bg-slate-700"}`}>{micMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}</button>
          <button onClick={() => setInCall(null)} className="p-5 rounded-full bg-red-600 hover:bg-red-700 shadow-xl"><PhoneOff className="w-8 h-8 text-white" /></button>
          <button onClick={() => setInCall(inCall === "video" ? "audio" : "video")} className="p-4 rounded-full bg-slate-700"><Video className="w-6 h-6 text-white" /></button>
        </div>
      </div>
    );
  }

  if (activeChat) {
    const currentChatMsgs = messages[activeChat.id] || [];
    const cleanPhone = activeChat.phone.replace(/[^0-9]/g, "");
    return (
      <div className="flex flex-col h-screen w-full bg-[#f4f6f8] text-slate-800 select-none max-w-md mx-auto">
        <div className="flex items-center justify-between px-3 py-3 border-b border-slate-200 bg-[#0088cc] text-white shadow-sm">
          <div className="flex items-center space-x-2">
            <button onClick={() => setActiveChat(null)} className="p-1"><ArrowLeft className="w-6 h-6" /></button>
            <div><h2 className="font-semibold text-sm">{activeChat.name}</h2><p className="text-[10px] text-blue-100">{activeChat.phone} • Online</p></div>
          </div>
          <div className="flex items-center space-x-3">
            <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer" className="p-1 hover:opacity-80" title="Open in WhatsApp">
              <MessageCircle className="w-5 h-5 fill-white" />
            </a>
            <button onClick={() => setInCall("audio")} className="p-1 hover:opacity-80"><Phone className="w-5 h-5 fill-white" /></button>
            <button onClick={() => setInCall("video")} className="p-1 hover:opacity-80"><Video className="w-5 h-5 fill-white" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex justify-center"><span className="text-[11px] bg-white text-slate-500 px-3 py-1 rounded-full border border-slate-200 shadow-sm">Caller X End-to-End Encrypted</span></div>
          {currentChatMsgs.map((msg: any) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm shadow-sm ${msg.sender === "me" ? "bg-[#0088cc] text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border border-slate-200"}`}>{msg.text}</div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>
        <div className="px-3 py-2 flex items-center justify-between text-xl bg-white border-t border-slate-200">
          {EMOJI_LIST.map((emoji, index) => <button key={index} onClick={() => sendMessage(emoji)} className="hover:scale-125 transition-transform active:scale-95">{emoji}</button>)}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputVal); }} className="p-2 bg-white flex items-center space-x-2 border-t border-slate-200">
          <div className="flex items-center bg-slate-100 rounded-full flex-1 px-3 py-1.5 border border-slate-200">
            <Smile className="w-5 h-5 text-slate-400 mr-2 cursor-pointer" onClick={() => setInputVal(prev => prev + "😊")} />
            <input type="text" placeholder="Message" value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="bg-transparent text-sm text-slate-800 focus:outline-none flex-1 placeholder-slate-400" />
            <ImageIcon className="w-5 h-5 text-slate-400 ml-2 cursor-pointer" /><Plus className="w-5 h-5 text-slate-400 ml-2 cursor-pointer" />
          </div>
          {inputVal.trim() ? <button type="submit" className="p-2.5 rounded-full bg-[#0088cc] text-white shadow"><Send className="w-4 h-4" /></button> : <button type="button" className="p-2.5 rounded-full bg-[#0088cc] text-white shadow"><Mic className="w-5 h-5" /></button>}
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white text-slate-800 select-none max-w-md mx-auto">
      <div className="bg-[#0088cc] text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white text-[#0088cc] flex items-center justify-center font-bold text-sm shadow">X</div>
            <div><h1 className="text-base font-bold tracking-wide leading-none">Caller X</h1><p className="text-[10px] text-blue-100 font-medium mt-0.5 flex items-center gap-1"><Globe className="w-3 h-3" /> Worldwide</p></div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full text-xs font-medium text-white transition"><UserPlus className="w-3.5 h-3.5" /><span>Add</span></button>
            <button className="p-1 hover:bg-white/10 rounded-full"><Search className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-xs text-amber-800">
        <div className="flex items-center gap-1.5 font-medium">
          <DollarSign className="w-4 h-4 text-amber-600" />
          <span>Special Client Offer: 50% Off on Services!</span>
        </div>
        <button className="bg-amber-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">Order</button>
      </div>

      <div className="flex items-center space-x-4 px-3 py-3 overflow-x-auto bg-slate-50 no-scrollbar border-b border-slate-200">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center relative border border-slate-300 shadow-sm"><Plus className="w-5 h-5 text-slate-600" /><span className="absolute bottom-0 right-0 w-4 h-4 bg-[#0088cc] rounded-full flex items-center justify-center text-white text-xs font-bold leading-none">+</span></div>
          <span className="text-[11px] text-slate-500 mt-1">Story</span>
        </div>
        {contacts.slice(0, 4).map((c: any) => (
          <div key={c.id} onClick={() => setActiveChat(c)} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
            <div className="relative"><div className="w-12 h-12 rounded-full bg-blue-100 text-[#0088cc] border-2 border-green-500 flex items-center justify-center font-bold text-sm shadow-sm">{c.name[0]}</div><span className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">1</span></div>
            <span className="text-[11px] text-slate-700 mt-1 truncate w-14 text-center">{c.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
        {contacts.map((c: any) => (
          <div key={c.id} onClick={() => setActiveChat(c)} className="flex items-center justify-between px-3.5 py-3 hover:bg-slate-50 transition cursor-pointer">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0"><div className="w-12 h-12 rounded-full bg-blue-50 text-[#0088cc] flex items-center justify-center font-bold text-base border border-blue-100">{c.name[0]}</div>{c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>}</div>
              <div className="flex-1 min-w-0"><h3 className="font-semibold text-slate-800 text-sm truncate">{c.name}</h3><p className="text-xs text-slate-500 truncate mt-0.5">{c.phone}</p></div>
            </div>
            <div className="flex items-center space-x-3 pl-3">
              <button onClick={(e) => { e.stopPropagation(); setActiveChat(c); setInCall("audio"); }} className="p-1 text-[#0088cc] hover:text-blue-700"><Phone className="w-5 h-5 fill-[#0088cc]" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-100 border-t border-slate-200 py-2 text-center text-xs text-slate-500 font-medium">
        Sponsored Ad: Boost Your Business with Caller X
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-c
