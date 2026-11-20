"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sprout, KeyRound, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useVerifyOtp, useRequestOtp } from "@/features/auth/hooks/use-auth";

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(60);

  const verifyMutation = useVerifyOtp();
  const requestOtpMutation = useRequestOtp();

  useEffect(() => {
    if (!phone) {
      router.push("/masuk");
    }
  }, [phone, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0) return;
    setErrorMsg("");
    try {
      await requestOtpMutation.mutateAsync(phone);
      setCountdown(60);
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal mengirim ulang kode verifikasi.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanCode = otpCode.trim();
    if (cleanCode.length !== 4) {
      setErrorMsg("Masukkan 4 digit kode verifikasi yang telah dikirim.");
      return;
    }

    try {
      const res = await verifyMutation.mutateAsync({
        phone,
        otpCode: cleanCode,
      });

      if (res.isNewUser) {
        router.push(`/daftar?phone=${encodeURIComponent(phone)}`);
      } else if (res.user) {
        if (res.user.role === "petani") {
          router.push("/petani");
        } else if (res.user.role === "pembeli") {
          router.push("/pembeli");
        } else {
          router.push("/admin");
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Kode verifikasi tidak cocok. Silakan periksa kembali.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 sm:py-12 px-4">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Verifikasi Nomor
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Kode verifikasi 4-digit telah dikirimkan ke:
          <br />
          <span className="font-semibold text-foreground tabular-nums text-base">{phone}</span>
        </p>
      </div>

      <Card className="rounded-2xl border-border/80 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">Masukkan Kode Verifikasi</CardTitle>
          <CardDescription className="text-xs">
            Pastikan nomor ponsel Anda aktif untuk menerima pesan konfirmasi.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleVerify}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-semibold">
                Kode 4-Digit
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <KeyRound className="w-4 h-4" />
                </div>
                <Input
                  id="otp"
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="pl-10 text-center tracking-[0.5em] text-xl font-bold min-h-12 tabular-nums"
                  disabled={verifyMutation.isPending}
                  autoFocus
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-relaxed">
                {errorMsg}
              </div>
            )}

            {/* Petunjuk Pengujian Sandbox */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-1">
              <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Petunjuk Verifikasi Cepat Sandbox:
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sistem saat ini dalam tahap integrasi. Masukkan kode <strong className="text-foreground font-mono">1234</strong> untuk verifikasi instan.
              </p>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Tidak menerima kode verifikasi?{" "}
                {countdown > 0 ? (
                  <span className="font-semibold text-foreground tabular-nums">
                    Kirim ulang dalam {countdown} detik
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={requestOtpMutation.isPending}
                    className="font-semibold text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Kirim Ulang Kode
                  </button>
                )}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full min-h-11 text-base font-semibold"
              disabled={verifyMutation.isPending || otpCode.length !== 4}
            >
              {verifyMutation.isPending ? "Memverifikasi..." : "Konfirmasi & Masuk"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="flex items-center justify-center w-full pt-2">
              <Link
                href="/masuk"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Ganti Nomor Ponsel
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Memuat halaman verifikasi...</div>}>
      <VerificationContent />
    </Suspense>
  );
}
