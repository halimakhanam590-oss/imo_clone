"use client";

import React, { useState, useEffect } from "react";
import { 
  Phone, 
  Video, 
  PhoneOff, 
  Search, 
  MessageSquare, 
  Users, 
  Compass, 
  ArrowLeft, 
  Mic, 
  MicOff,
  MoreVertical,
  ShieldCheck,
  Smartphone
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  tel: string;
}

export default function ImoApp() {
  const [step, setStep] = useState<"auth" | "permission" | "app">("auth");
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState("chats");
  const [inCall, setInCall] = useState(false);
  const [callingUser, setCallingUser] = useState<string | null>(null);
  const [micMuted, setMicMuted] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("imo_user_email");
    const savedContacts = localStorage.getItem("imo_contacts");
    if (savedUser && savedContacts) {
      setUserEmail(savedUser);
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (e) {}
      setStep("app");
    }
  }, []);

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !phoneNumber) return;
    localStorage.setItem("imo_user_email", userEmail);
    localStorage.setItem("imo_user_phone", phoneNumber);
    setStep("permission");
  };

  const requestContactPermission = async () => {
    if ("contacts" in navigator && "ContactsManager" in window) {
      try {
        const props = ["name", "tel"];
        const selected = await (navigator as any).contacts.select(props, { multiple: true });
        if (selected && selected.length > 0) {
          const formatted: Contact[] = selected.map((c: any, index: number) => ({
            id: Date.now() + "-" + index,
            name: c.name?.[0] || "Unknown Contact",
            tel: c.tel?.[0] || "",
          }));
          setContacts(formatted);
          localStorage.setItem("imo_contacts", JSON.stringify(formatted));
        }
      } catch (err) {
        console.log("Permission denied or cancelled");
      }
    } else {
      // Fallback demo contacts if browser does not support contacts picker API
      const defaultContacts: Contact[] = [
        { id: "1", name: "Client 1", tel: "+8801700000001" },
        { id: "2", name: "Client 2", tel: "+8801800000002" },
      ];
      setContacts(defaultContacts);
      localStorage.setItem("imo_contacts", JSON.stringify(defaultContacts));
    }
    setStep("app");
  };

  const startCall = (name: string) => {
    setCallingUser(name);
    setInCall(true);
  };

  const endCall = () => {
    setInCall(false);
    setCallingUser(null);
  };

  // 1. Google & Phone Login Screen
  if (step === "auth") {
    return (
      <div className="flex flex-col h-screen w-full bg-white max-w-md mx-auto p-6 justify-between select-none">
        <div className="flex flex-col items-center mt-8">
          <div className="w-16 h-16 rounded-2xl bg-[#0088cc] flex items-center justify-center text-white text-3xl font-extrabold shadow-md mb-3">
            i
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">imo Messenger</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in with your Google account & phone</p>
        </div>

        <form onSubmit={handleGoogleLogin} className="w-full space-y-4 my-auto">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Google Email</label>
            <input 
              type="email" 
              required
              placeholder="example@gmail.com" 
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0088cc]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Phone Number</label>
            <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2.5">
              <Smartphone className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="tel" 
                required
                placeholder="+880 1XXX-XXXXXX" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full text-sm focus:outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#0088cc] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#0077b5] shadow transition mt-2"
          >
            Continue with Google
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400 mb-4">
          By signing in, you agree to imo Terms & Privacy Policy
        </p>
      </div>
    );
  }

  // 2. Permission Request Screen
  if (step === "permission") {
    return (
      <div className="flex flex-col h-screen w-full bg-white max-w-md mx-auto p-6 justify-between select-none">
        <div className="flex flex-col items-center mt-12 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 text-[#0088cc] flex items-center justify-center mb-4">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Allow Contact Access</h2>
          <p className="text-xs text-slate-500 mt-2 px-4 leading-relaxed">
            imo needs access to your contacts to find friends, clients, and let you make free audio/video calls easily.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-2">
          <p className="flex items-center gap-2">✓ Automatic contact sync</p>
          <p className="flex items-center gap-2">✓ See which clients are online</p>
          <p className="flex items-center gap-2">✓ High-quality encrypted calls</p>
        </div>

        <div className="space-y-3 mb-6">
          <button 
            onClick={requestContactPermission}
            className="w-full bg-[#0088cc] text-white py-3 rounded-xl font-semibold text-sm shadow hover:bg-[#0077b5] transition"
          >
            Allow Contact Permission
          </button>
          <button 
            onClick={() => setStep("app")}
            className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-semibold text-sm hover:bg-slate-200 transition"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  // Call Screen
  if (inCall) {
    return (
      <div className="flex flex-col h-screen w-full bg-slate-900 text-white select-none">
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
          <button onClick={endCall} className="p-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="font-semibold text-lg">{callingUser}</h2>
            <p className="text-xs text-green-400 font-medium">imo HD Calling...</p>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="w-28 h-28 rounded-full bg-[#0088cc] flex items-center justify-center text-4xl font-bold border-4 border-white/20 animate-pulse">
            {callingUser?.[0] || "U"}
          </div>
          <p className="mt-4 text-slate-300 text-sm">Connecting call...</p>
        </div>

        <div className="p-8 flex items-center justify-around bg-gradient-to-t from-black/80 to-transparent">
          <button 
            onClick={() => setMicMuted(!micMuted)}
            className={`p-4 rounded-full ${micMuted ? "bg-red-500" : "bg-white/20"}`}
          >
            {micMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button 
            onClick={endCall}
            className="p-5 rounded-full bg-red-600 shadow-xl"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
          <button className="p-4 rounded-full bg-white/20">
            <Video className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    );
  }

  // 3. Main Imo App
  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans select-none max-w-md mx-auto">
      {/* Top Header */}
      <div className="bg-[#0088cc] text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-white text-[#0088cc] flex items-center justify-center font-bold text-lg shadow-inner">
              i
            </div>
            <div>
              <h1 className="text-lg font-bold">imo</h1>
              <p className="text-[10px] text-blue-100 truncate max-w-[150px]">{userEmail || "Signed in"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white/10 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Contacts / Chats */}
      <div className="flex-1 overflow-y-auto bg-white divide-y divide-slate-100">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
            <Users className="w-14 h-14 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No synced contacts yet</p>
            <p className="text-xs text-slate-400 mt-1">Tap below to grant contact permission</p>
            <button
              onClick={requestContactPermission}
              className="mt-4 bg-[#0088cc] text-white text-xs px-4 py-2 rounded-full shadow hover:bg-[#0077b5]"
            >
              Sync Phone Contacts
            </button>
          </div>
        ) : (
          contacts.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-[#e8f4fc] text-[#0088cc] flex items-center justify-center font-bold text-base border border-blue-100">
                  {c.name[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm truncate">{c.name}</h3>
                  <p className="text-xs text-slate-400 truncate">{c.tel || "Mobile"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => startCall(c.name)}
                  className="p-2 text-[#0088cc] hover:bg-blue-50 rounded-full transition"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => startCall(c.name)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Tabs */}
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
