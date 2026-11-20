"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminLogin } from "@/features/auth/hooks/use-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@sambung.id");
  const [password, setPassword] = useState("admin123");
  const [errorMsg, setErrorMsg] = useState("");

  const adminLoginMutation = useAdminLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Email dan kata sandi pengelola wajib diisi.");
      return;
    }

    try {
      await adminLoginMutation.mutateAsync({ email, password });
      router.push("/admin");
    } catch (err: any) {
      setErrorMsg(err?.message || "Kredensial pengelola tidak sesuai. Silakan periksa kembali.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-[#070D09] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Portal Pengawas & Tata Kelola
          </h1>
          <p className="text-xs text-muted-foreground">
            Sistem Informasi Agrikultur Modern Berbasis Unggulan Nilai Gabah
          </p>
        </div>

        <Card className="rounded-2xl border-border/80 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Masuk Sebagai Pengelola</CardTitle>
            <CardDescription className="text-xs">
              Akses khusus staf pengawas data harga, kalibrasi parameter pasar, dan audit sistem.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-xs font-semibold">
                  Alamat Email Resmi
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@sambung.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 min-h-11 text-sm font-mono"
                    disabled={adminLoginMutation.isPending}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-xs font-semibold">
                  Kata Sandi Pengelola
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 min-h-11 text-sm"
                    disabled={adminLoginMutation.isPending}
                    required
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-relaxed">
                  {errorMsg}
                </div>
              )}

              <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs space-y-1">
                <p className="font-semibold text-foreground">Kredensial Evaluasi Pitching:</p>
                <p className="text-muted-foreground font-mono text-[11px]">Email: admin@sambung.id</p>
                <p className="text-muted-foreground font-mono text-[11px]">Sandi: admin123</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                className="w-full min-h-11 font-semibold"
                disabled={adminLoginMutation.isPending}
              >
                {adminLoginMutation.isPending ? "Mengautentikasi..." : "Masuk ke Panel Pengawasan"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="flex items-center justify-center w-full pt-2">
                <Link
                  href="/"
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali ke Portal Publik
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
