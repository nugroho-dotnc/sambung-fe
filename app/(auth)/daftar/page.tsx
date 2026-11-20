"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sprout, Building2, User, MapPin, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRegisterProfile } from "@/features/auth/hooks/use-auth";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [role, setRole] = useState<"petani" | "pembeli">("petani");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [province, setProvince] = useState("Jawa Barat");
  const [regency, setRegency] = useState("Subang");
  const [district, setDistrict] = useState("Pagaden");
  const [agreedToTerms, setAgreedToTerms] = useState(false); // FR-002.13: TIDAK tercentang otomatis!
  const [errorMsg, setErrorMsg] = useState("");

  const registerMutation = useRegisterProfile();

  useEffect(() => {
    if (!phone) {
      router.push("/masuk");
    }
  }, [phone, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Nama lengkap wajib diisi.");
      return;
    }
    if (!district.trim()) {
      setErrorMsg("Kecamatan domisili usaha/lahan wajib diisi.");
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg("Anda harus membaca dan mencentang persetujuan Ketentuan Layanan untuk melanjutkan.");
      return;
    }

    try {
      const res = await registerMutation.mutateAsync({
        phone,
        role,
        name: name.trim(),
        province,
        regency,
        district: district.trim(),
        businessName: businessName.trim() || undefined,
        agreedToTerms: true,
      });

      if (res.user.role === "petani") {
        router.push("/petani");
      } else {
        router.push("/pembeli");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Pendaftaran gagal diproses. Silakan lengkapi data Anda.");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8 sm:py-12 px-4">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Pendaftaran Profil Baru
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Nomor Anda <span className="font-semibold text-foreground tabular-nums">{phone}</span> belum terdaftar.
          <br />
          Lengkapi identitas untuk menentukan ruang kerja Anda di platform SAMBUNG.
        </p>
      </div>

      <Card className="rounded-2xl border-border/80 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">Pilih Peran & Identitas Usaha</CardTitle>
          <CardDescription className="text-xs">
            Peran ini bersifat permanen untuk menjamin transparansi dan keamanan kesepakatan pasokan gabah.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Pemilihan Peran (Petani vs Pembeli) */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Pilih Peran Akun Anda</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("petani")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === "petani"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-border/80 bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                      <Sprout className="w-5 h-5" />
                    </div>
                    {role === "petani" && <Check className="w-4 h-4 text-primary" />}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Petani / Kelompok Tani</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Menawarkan hasil panen gabah, memeriksa batas harga wajar, dan menerima pesanan pabrik.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("pembeli")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === "pembeli"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-border/80 bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    {role === "pembeli" && <Check className="w-4 h-4 text-primary" />}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Pembeli / Penggilingan</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mencari pasokan gabah berkualitas di katalog dan mengajukan pesanan kesepakatan langsung.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Isian Identitas Diri */}
            <div className="space-y-4 pt-2 border-t border-border/60">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold">
                  Nama Lengkap Penanggung Jawab
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <User className="w-4 h-4" />
                  </div>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 min-h-11 text-base"
                    disabled={registerMutation.isPending}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-semibold">
                  Nama Kelompok Tani / Usaha Penggilingan (Opsional)
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Contoh: Poktan Subur Makmur / UD Tani Jaya"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-10 min-h-11 text-base"
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="province" className="text-xs font-semibold">
                    Provinsi
                  </Label>
                  <Input
                    id="province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="min-h-11 text-sm"
                    disabled={registerMutation.isPending}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="regency" className="text-xs font-semibold">
                    Kabupaten / Kota
                  </Label>
                  <Input
                    id="regency"
                    value={regency}
                    onChange={(e) => setRegency(e.target.value)}
                    className="min-h-11 text-sm"
                    disabled={registerMutation.isPending}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="district" className="text-xs font-semibold">
                    Kecamatan
                  </Label>
                  <Input
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="min-h-11 text-sm"
                    disabled={registerMutation.isPending}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Checkbox Persetujuan Syarat & Privasi (FR-002.13: Tidak boleh tercentang bawaan) */}
            <div className="pt-2 border-t border-border/60">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  disabled={registerMutation.isPending}
                  className="mt-0.5"
                />
                <Label htmlFor="terms" className="text-xs leading-relaxed text-muted-foreground font-normal cursor-pointer">
                  Saya menyatakan bahwa data yang diisikan benar dan menyetujui{" "}
                  <Link href="/bantuan" target="_blank" className="text-primary font-medium hover:underline">
                    Ketentuan Layanan & Kebijakan Data SAMBUNG
                  </Link>
                  . Saya memahami bahwa kesepakatan pasokan gabah bersifat mengikat komitmen harga dan volume secara digital.
                </Label>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-relaxed">
                {errorMsg}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full min-h-11 text-base font-semibold"
              disabled={registerMutation.isPending || !agreedToTerms}
            >
              {registerMutation.isPending ? "Mendaftarkan Akun..." : "Selesaikan Pendaftaran & Masuk"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="flex items-center justify-center w-full pt-2">
              <Link href="/masuk" className="text-xs text-muted-foreground hover:text-foreground">
                ← Batal & Gunakan Nomor Lain
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Memuat formulir pendaftaran...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
