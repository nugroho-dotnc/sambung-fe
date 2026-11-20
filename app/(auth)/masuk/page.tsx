"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sprout, Phone, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequestOtp } from "@/features/auth/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const requestOtpMutation = useRequestOtp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanPhone = phone.trim().replace(/[-\s]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg("Masukkan nomor ponsel yang valid (minimal 10 digit, contoh: 081234567890).");
      return;
    }

    try {
      await requestOtpMutation.mutateAsync(cleanPhone);
      router.push(`/masuk/verifikasi?phone=${encodeURIComponent(cleanPhone)}`);
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal mengirimkan kode verifikasi. Silakan coba kembali.");
    }
  };

  const handleQuickFill = (testPhone: string) => {
    setPhone(testPhone);
    setErrorMsg("");
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 sm:py-12 px-4">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
            <Sprout className="w-7 h-7" />
          </div>
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Masuk ke SAMBUNG
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Platform Transparansi Harga & Kesepakatan Pasokan Gabah Terpercaya
        </p>
      </div>

      <Card className="rounded-2xl border-border/80 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">Akses Akun Pengguna</CardTitle>
          <CardDescription className="text-xs">
            Masuk sebagai Petani atau Pembeli tanpa kata sandi menggunakan nomor ponsel Anda.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold">
                Nomor Ponsel (WhatsApp / SMS)
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Phone className="w-4 h-4" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 min-h-11 text-base tabular-nums"
                  disabled={requestOtpMutation.isPending}
                  autoFocus
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-relaxed">
                {errorMsg}
              </div>
            )}

            {/* Rekomendasi Akun Uji untuk Kemudahan Evaluasi */}
            <div className="rounded-xl border border-border/60 bg-muted/40 p-3 space-y-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-primary" />
                Nomor Akun Terdaftar untuk Uji Coba:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickFill("081234567890")}
                  className="text-left p-2 rounded-lg bg-background border border-border/70 hover:border-primary transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-foreground">Pak Subur</p>
                  <p className="text-[11px] text-muted-foreground">Role Petani (Subang)</p>
                  <span className="text-[11px] font-mono text-primary">081234567890</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("081398765432")}
                  className="text-left p-2 rounded-lg bg-background border border-border/70 hover:border-primary transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-foreground">H. Hendra</p>
                  <p className="text-[11px] text-muted-foreground">Role Pembeli (Karawang)</p>
                  <span className="text-[11px] font-mono text-primary">081398765432</span>
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                *Atau masukkan nomor baru untuk mencoba alur pendaftaran profil baru.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full min-h-11 text-base font-semibold"
              disabled={requestOtpMutation.isPending}
            >
              {requestOtpMutation.isPending ? "Mengirim Kode..." : "Lanjutkan Verifikasi"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="flex items-center justify-between w-full pt-3 border-t border-border/60 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground hover:underline">
                ← Kembali ke Beranda
              </Link>
              <Link href="/admin/masuk" className="font-medium text-foreground hover:underline flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                Masuk Pengelola (Admin)
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
