"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { getChartData } from "@/actions/dashboard"; 
import { Button } from "@/components/ui/button";
import { Loader2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DashboardChart() {
  const [range, setRange] = useState<"7d" | "1m" | "6m" | "1y">("7d");
  const [unit, setUnit] = useState<string>("ALL"); // YENİ: Birim Filtresi
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Range veya Unit değişince veriyi yeniden çek
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Server Action'a artık 'unit' bilgisini de gönderiyoruz
        const result = await getChartData(range, unit);
        setData(result);
      } catch (error) {
        console.error("Grafik verisi alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range, unit]);

  return (
    <div className="w-full mt-4">
      
      {/* ÜST FİLTRE ALANI (Flex ile ikiye böldük: Sol ve Sağ) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        
        {/* SOL: BİRİM SEÇİMİ (DROPDOWN) */}
        <div className="w-full sm:w-48">
             <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="h-9 text-xs font-bold bg-slate-50 border-slate-200 text-slate-700">
                    <div className="flex items-center gap-2">
                        <Filter className="w-3 h-3 text-slate-400" />
                        <SelectValue placeholder="Birim Seç" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">📋 Ähli Hereketler (Giriş/Çykyş)</SelectItem>
                    <SelectItem value="PIECE">📦 Sany (Adet) Boýunça</SelectItem>
                    <SelectItem value="METER">📏 Metr (m) Boýunça</SelectItem>
                    <SelectItem value="KG">⚖️ Kilogram (kg) Boýunça</SelectItem>
                    <SelectItem value="LITER">💧 Litr (Lt) Boýunça</SelectItem>
                    <SelectItem value="BOX">📦 Guty (Gap) Boýunça</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* SAĞ: ZAMAN ARALIĞI BUTONLARI */}
        <div className="flex gap-2 self-end sm:self-auto">
            <FilterButton label="7 Gün" active={range === "7d"} onClick={() => setRange("7d")} />
            <FilterButton label="1 Aý" active={range === "1m"} onClick={() => setRange("1m")} />
            <FilterButton label="6 Aý" active={range === "6m"} onClick={() => setRange("6m")} />
            <FilterButton label="1 Ýyl" active={range === "1y"} onClick={() => setRange("1y")} />
        </div>

      </div>

      {/* 2. GRAFİK ALANI */}
      <div className="h-[350px] w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
            Bu görnüşe görä hereket tapylmady.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  borderRadius: "12px", 
                  border: "none", 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#1e293b"
                }}
                cursor={{ fill: "#f8fafc", radius: 4 }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} />
              
              {/* Giriş Çubuğu */}
              <Bar 
                dataKey="Giris" 
                name={unit === "ALL" ? "Giriş (Hereket Sany)" : "Giriş (Mukdar)"} 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
                animationDuration={1000}
              />
              
              {/* Çıkış Çubuğu */}
              <Bar 
                dataKey="Cikis" 
                name={unit === "ALL" ? "Çykyş (Hereket Sany)" : "Çykyş (Mukdar)"} 
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// Buton Bileşeni (Aynı Kaldı)
function FilterButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className={`rounded-lg text-[11px] font-bold h-8 px-3 transition-all ${
        active 
          ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md ring-2 ring-slate-100 ring-offset-1" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      {label}
    </Button>
  );
}