"use client"; // Bu satır sayesinde tarayıcıda çalışır ve tıklanabilir

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button 
      onClick={() => window.print()} // ARTIK ÇALIŞIR! 🖨️
      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all active:scale-95"
    >
      <Printer className="w-4 h-4 mr-2" /> Çap Et / Yazdır
    </Button>
  );
}