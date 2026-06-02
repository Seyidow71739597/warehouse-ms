"use client";

import { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, X, ImagePlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// Projenin kendi Input bileşenini kullanıyoruz (Büyük I ile)
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  name: string;
  label?: string;
}

export function ImageUpload({ name, label = "Surat Ýükle" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Referans Tanımı
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 10MB Kontrolü
    if (file.size > 10 * 1024 * 1024) {
      setError("Faýl ölçegi örän uly! (Max 10MB)");
      setPreview(null);
      // Inputu temizle
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError(null);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-3 w-full">
      <Label className="text-base font-semibold text-slate-900 flex items-center gap-2">
        <ImagePlus className="w-4 h-4 text-blue-600" />
        {label} (Opsional)
      </Label>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm font-bold animate-pulse">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* GÖRSEL ALAN */}
      <div 
        onClick={onUploadClick}
        className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all overflow-hidden group"
      >
        {preview ? (
          // RESİM VARSA
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            
            {/* Silme butonu için onClick olayını yukarı taşımaması gerek (stopPropagation) */}
            <div className="absolute top-2 right-2 z-10">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="rounded-full w-8 h-8 shadow-md"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          // RESİM YOKSA
          <div className="flex flex-col items-center justify-center text-slate-500">
            <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 text-blue-500" />
            </div>
            <p className="font-bold text-sm">Surat saýlamak üçin basyň</p>
            <p className="text-xs mt-1">PNG, JPG (Max 10MB)</p>
          </div>
        )}
      </div>

      {/* ÇÖZÜM BURADA: 
          Küçük 'input' yerine projedeki 'Input' bileşenini kullandık.
          Bu bileşen 'forwardRef' desteklediği için hata vermez.
      */}
      <Input
        ref={inputRef}
        name={name} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
      />
    </div>
  );
}