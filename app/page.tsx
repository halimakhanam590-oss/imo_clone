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
  UserPlus, 
  ArrowLeft, 
  Mic, 
  MicOff,
  MoreVertical,
  X
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  tel: string;
}

export default function ImoApp() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState("chats");
  const [inCall, setInCall] = useState(false);
  const [callingUser, setCallingUser] = useState<string | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("imo_contacts");
    if (saved) {
      try {
        setContacts(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveContacts = (updated: Contact[]) => {
    setContacts(updated);
    localStorage.setItem("imo_contacts", JSON.stringify(updated));
  };

  // ফোনের আসল কন্টাক্ট লিস্ট থেকে নাম্বার সিলেক্ট করা
  const importPhoneContacts = async () => {
    if ("contacts" in navigator && "ContactsManager" in window) {
      try {
        const props = ["name", "tel"];
        const selected = await (navigator as any).contacts.select(props, { multiple: true });
        if (selected && selected.length > 0) {
          const formatted: Contact[] = selected.map((c: any, index: number) => ({
            id: Date.now() + "-" + index,
            name: c.name?.[0] || "Unknown",
            tel: c.tel?.[0] || "",
          }));
          const merged = [...contacts, ...formatted];
          saveContacts(merged);
        }
      } catch (ex) {
        alert("কন্টাক্ট পারমিশন দেওয়া হয়নি বা সাপোর্ট করছে না। নিচে হাত দিয়ে নাম্বার যোগ করতে পারেন।");
      }
    } else {
      setShowAddModal(true);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    const item: Contact = {
      id: Date.now().toString(),
      name: newName.trim(),
      tel: newPhone.trim(),
    };
    saveContacts([...contacts, item]);
    setNewName("");
    setNewPhone("");
    setShowAddModal(false);
  };

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
          <p className="mt-4 text-slate-300 text-sm">Waiting for response...</p>
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

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans select-none">
      {/* Header */}
      <div className="bg-[#0088cc] text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-white text-[#0088cc] flex items-center justify-center font-bold text-lg">
              i
            </div>
            <div>
              <h1 className="text-lg font-bold">imo</h1>
              <p className="text-[11px] text-blue-100">Free Calls & Chat</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={importPhoneContacts} 
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sync Contacts</span>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto bg-white divide-y divide-slate-100">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
            <Users className="w-16 h-16 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-600">কোনো কন্টাক্ট নেই</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              উপরের <b>Sync Contacts</b> বাটনে চেপে ফোনবুক থেকে আসল নাম্বার সিলেক্ট করুন অথবা নিজে যোগ করুন।
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-[#0088cc] text-white text-xs px-4 py-2 rounded-full shadow"
            >
              + নতুন নাম্বার যোগ করুন
            </button>
          </div>
        ) : (
          contacts.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0088cc] flex items-center justify-center font-bold text-lg border border-blue-100">
                  {c.name[0] || "U"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm truncate">{c.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{c.tel || "No number"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => startCall(c.name)}
                  className="p-2 text-[#0088cc] hover:bg-blue-50 rounded-full"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => startCall(c.name)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Contact Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-sm p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800 text-base">নতুন কন্টাক্ট যোগ করুন</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">নাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Rahim"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0088cc]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">ফোন নম্বর</label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: +88017xxxxxxxx"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0088cc]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0088cc] text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 mt-2"
              >
                সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Tabs */}
      <div className="bg-white border-t border-slate-200 py-2 px-6 flex justify-around items-center text-slate-500">
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
