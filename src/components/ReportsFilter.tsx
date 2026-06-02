"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter, X, Search, Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ReportsFilterProps {
  users: any[];
  partners: any[];
}

export function ReportsFilter({ users, partners }: ReportsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- TEMEL FİLTRE STATE'LERİ ---
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [type, setType] = useState(searchParams.get("type") || "ALL");
  const [userId, setUserId] = useState(searchParams.get("userId") || "ALL");
  const [partnerId, setPartnerId] = useState(searchParams.get("partnerId") || "ALL");

  // --- CANLI ARAMA STATE'LERİ (USER) ---
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const userWrapperRef = useRef<HTMLDivElement>(null);

  // --- CANLI ARAMA STATE'LERİ (PARTNER) ---
  const [showPartnerSearch, setShowPartnerSearch] = useState(false);
  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const partnerWrapperRef = useRef<HTMLDivElement>(null);

  // DIŞARI TIKLAYINCA KAPATMA (User & Partner)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userWrapperRef.current && !userWrapperRef.current.contains(event.target as Node)) {
        setShowUserSearch(false);
      }
      if (partnerWrapperRef.current && !partnerWrapperRef.current.contains(event.target as Node)) {
        setShowPartnerSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- USER FİLTRELEME MANTIĞI ---
  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // --- PARTNER FİLTRELEME MANTIĞI ---
  const filteredPartners = partners.filter((p) => 
    p.name.toLowerCase().includes(partnerSearchQuery.toLowerCase())
  );

  // SEÇİLİ OLANLARIN İSMİNİ BULMA (Buton üzerinde göstermek için)
  const selectedUser = users.find(u => u.id === userId);
  const selectedPartner = partners.find(p => p.id === partnerId);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (type && type !== "ALL") params.set("type", type);
    if (userId && userId !== "ALL") params.set("userId", userId);
    if (partnerId && partnerId !== "ALL") params.set("partnerId", partnerId);

    router.push(`?${params.toString()}`);
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setType("ALL");
    setUserId("ALL");
    setPartnerId("ALL");
    setUserSearchQuery("");
    setPartnerSearchQuery("");
    router.push("?");
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end flex-wrap">
      
      {/* 1. TARİH ARALIĞI */}
      <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Başlangyç</label>
          <Input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="rounded-xl border-slate-200 bg-slate-50 h-10"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gutoryş</label>
          <Input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="rounded-xl border-slate-200 bg-slate-50 h-10"
          />
        </div>
      </div>

      {/* 2. İŞLEM TÜRÜ (SELECT KALABİLİR, AZ SEÇENEK VAR) */}
      <div className="w-full md:w-32 space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Görnüş</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50 h-10">
            <SelectValue placeholder="Hemmesi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Hemmesi</SelectItem>
            <SelectItem value="IN">⬇️ Giriş</SelectItem>
            <SelectItem value="OUT">⬆️ Çykyş</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 3. AMALY ÝERİNE ÝETİREN (CANLI ARAMA) */}
      <div className="w-full md:w-48 space-y-1 relative" ref={userWrapperRef}>
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Amaly Ýerine Ýetiren</label>
        
        {/* BUTON GÖRÜNÜMÜ */}
        {!showUserSearch ? (
          <button 
            onClick={() => setShowUserSearch(true)}
            className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-slate-900"
          >
            <span className="truncate">{selectedUser ? selectedUser.name : "Hemmesi"}</span>
            <ChevronDown className="w-4 h-4 text-slate-400 opacity-50" />
          </button>
        ) : (
          /* AÇILAN ARAMA KUTUSU */
          <div className="absolute top-6 left-0 w-64 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-200">
             <div className="relative mb-2">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />
                <Input 
                   autoFocus
                   placeholder="Gözle..." 
                   value={userSearchQuery}
                   onChange={(e) => setUserSearchQuery(e.target.value)}
                   className="pl-8 h-9 text-sm"
                />
             </div>
             <div className="max-h-48 overflow-y-auto space-y-1">
                <div 
                  onClick={() => { setUserId("ALL"); setShowUserSearch(false); setUserSearchQuery(""); }}
                  className="px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-600 flex items-center justify-between"
                >
                   Hemmesi
                   {userId === "ALL" && <Check className="w-4 h-4 text-green-600" />}
                </div>
                {filteredUsers.map((u) => (
                   <div 
                      key={u.id}
                      onClick={() => { setUserId(u.id); setShowUserSearch(false); setUserSearchQuery(""); }}
                      className="px-2 py-1.5 rounded-lg hover:bg-blue-50 cursor-pointer text-sm text-slate-900 flex items-center justify-between"
                   >
                      {u.name}
                      {userId === u.id && <Check className="w-4 h-4 text-blue-600" />}
                   </div>
                ))}
                {filteredUsers.length === 0 && <p className="text-xs text-center text-slate-400 py-2">Tapylmady</p>}
             </div>
          </div>
        )}
      </div>

      {/* 4. TABŞYRYLAN KİŞİ (CANLI ARAMA) */}
      <div className="w-full md:w-48 space-y-1 relative" ref={partnerWrapperRef}>
        {/* ETİKET DEĞİŞTİRİLDİ */}
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tabşyrylan Kişi</label>
        
        {/* BUTON GÖRÜNÜMÜ */}
        {!showPartnerSearch ? (
          <button 
            onClick={() => setShowPartnerSearch(true)}
            className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-slate-900"
          >
            <span className="truncate">{selectedPartner ? selectedPartner.name : "Hemmesi"}</span>
            <ChevronDown className="w-4 h-4 text-slate-400 opacity-50" />
          </button>
        ) : (
          /* AÇILAN ARAMA KUTUSU */
          <div className="absolute top-6 left-0 w-64 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-200">
             <div className="relative mb-2">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />
                <Input 
                   autoFocus
                   placeholder="Gözle..." 
                   value={partnerSearchQuery}
                   onChange={(e) => setPartnerSearchQuery(e.target.value)}
                   className="pl-8 h-9 text-sm"
                />
             </div>
             <div className="max-h-48 overflow-y-auto space-y-1">
                <div 
                  onClick={() => { setPartnerId("ALL"); setShowPartnerSearch(false); setPartnerSearchQuery(""); }}
                  className="px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-600 flex items-center justify-between"
                >
                   Hemmesi
                   {partnerId === "ALL" && <Check className="w-4 h-4 text-green-600" />}
                </div>
                {filteredPartners.map((p) => (
                   <div 
                      key={p.id}
                      onClick={() => { setPartnerId(p.id); setShowPartnerSearch(false); setPartnerSearchQuery(""); }}
                      className="px-2 py-1.5 rounded-lg hover:bg-blue-50 cursor-pointer text-sm text-slate-900 flex items-center justify-between"
                   >
                      {p.name}
                      {partnerId === p.id && <Check className="w-4 h-4 text-blue-600" />}
                   </div>
                ))}
                {filteredPartners.length === 0 && <p className="text-xs text-center text-slate-400 py-2">Tapylmady</p>}
             </div>
          </div>
        )}
      </div>

      {/* BUTONLAR */}
      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
        <Button onClick={handleFilter} className="flex-1 md:flex-none rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 h-10">
          <Filter className="w-4 h-4 mr-2" /> Filtirle
        </Button>
        <Button onClick={clearFilter} variant="outline" className="flex-1 md:flex-none rounded-xl border-slate-200 text-slate-500 hover:text-slate-700 h-10">
          <X className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
}