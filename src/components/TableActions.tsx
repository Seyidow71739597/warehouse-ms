"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash, Copy, Printer } from "lucide-react";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteProduct } from "@/actions/product";
import { deleteTransaction } from "@/actions/transaction";
import { deletePartner } from "@/actions/general"; 
import { rejectUser } from "@/actions/admin"; 

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TableActionsProps {
  id: string;
  type: "product" | "transaction" | "partner" | "user";
  locale: string;
}

export function TableActions({ id, type, locale }: TableActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCopyId = () => {
    navigator.clipboard.writeText(id);
    toast.success("ID kopyalandy!");
  };

  const handleEdit = () => {
    const pathMap = {
      product: `/${locale}/products/${id}/edit`,
      transaction: `/${locale}/transactions/${id}`, 
      partner: `/${locale}/partners/${id}/edit`,
      user: `/${locale}/settings/${id}`,
    };
    
    if (pathMap[type]) {
        router.push(pathMap[type]);
    }
  };

  const handleDelete = async () => {
    startTransition(async () => {
      let result;
      
      if (type === "product") result = await deleteProduct(id);
      if (type === "transaction") result = await deleteTransaction(id);
      if (type === "partner") result = await deletePartner(id);
      if (type === "user") result = await rejectUser(id);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Üstünlikli pozuldy!");
        setOpen(false);
      }
    });
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-white rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hakykatdanam pozmak isleýärsiňizmi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem yzyna gaýtarylyp bilinmez. Bu maglumat hemişelik öçüriler.
              {type === 'transaction' && (
                <span className="block mt-2 font-bold text-red-600">
                  Dikkat: Bu hereketi pozsaňyz, haryt stogy awtomatiki düzediler!
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-0 hover:bg-slate-100">Ýatyr</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              {isPending ? "Pozulýar..." : "Poz (Sil)"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
            <span className="sr-only">Menü</span>
            <MoreHorizontal className="h-4 w-4 text-slate-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-lg bg-white">
          <DropdownMenuLabel>Amallar</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopyId} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            ID Göçür
          </DropdownMenuItem>
          
          {/* --- BURASI DEĞİŞTİ: Transaction ise Düzelt butonunu GİZLE --- */}
          {type !== "transaction" && (
            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Düzelt
            </DropdownMenuItem>
          )}

          {type === "transaction" && (
            <DropdownMenuItem 
              onClick={() => {
                // Yeni sekmede aç
                window.open(`/${locale}/transactions/${id}/print`, '_blank');
              }} 
              className="cursor-pointer font-medium text-slate-700"
            >
              <Printer className="mr-2 h-4 w-4" />
              Çap Et (Fiş)
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setOpen(true)} className="text-red-600 focus:text-red-600 cursor-pointer bg-red-50 hover:bg-red-100">
            <Trash className="mr-2 h-4 w-4" />
            Poz (Sil)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}