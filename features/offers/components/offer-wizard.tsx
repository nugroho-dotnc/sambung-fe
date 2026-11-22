"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, ChevronRight, ArrowLeft, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { useOfferCommand } from "../hooks/use-offers";
import {
  offerInputSchema,
  type HarvestOffer,
  type OfferCommand,
  type OfferInput,
} from "../schemas";
import { OfferSummary, formatRupiah } from "./offer-summary";
import {
  PriceRangeSlider,
  ConfirmRedLightDialog,
  PriceReferenceService,
  evaluatePriceLight,
} from "@/features/price-check";
import { useMobile } from "@/hooks/use-mobile";

const emptyFields = {
  grainType: "GKP" as "GKP" | "GKG",
  districtId: "Pagaden",
  totalVolumeKg: "5000",
  askPrice: "7200",
  quality: "22.5",
  availableOn: "",
  notes: "",
};

const DISTRICT_OPTIONS = [
  { id: "Pagaden", label: "Kecamatan Pagaden, Kab. Subang" },
  { id: "Ciasem", label: "Kecamatan Ciasem, Kab. Subang" },
  { id: "Binong", label: "Kecamatan Binong, Kab. Subang" },
  { id: "Pamanukan", label: "Kecamatan Pamanukan, Kab. Subang" },
  { id: "Purwadadi", label: "Kecamatan Purwadadi, Kab. Subang" },
  { id: "Telagasari", label: "Kecamatan Telagasari, Kab. Karawang" },
];

const GRAIN_TYPE_OPTIONS = [
  { value: "GKP", label: "Gabah Kering Panen (GKP)" },
  { value: "GKG", label: "Gabah Kering Giling (GKG)" },
];

const DISTRICT_SELECT_ITEMS = DISTRICT_OPTIONS.map((d) => ({
  value: d.id,
  label: d.label,
}));

export function OfferWizard({
  initialOffer,
  onBack,
}: {
  initialOffer?: HarvestOffer;
  onBack?: () => void;
}) {
  const isMobile = useMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramGrainType = searchParams.get("grainType") as "GKP" | "GKG" | null;
  const paramAskPrice = searchParams.get("askPrice");
  const paramQuality = searchParams.get("quality");
  const { data: user } = useCurrentUser();

  const [fields, setFields] = useState({
    grainType: paramGrainType || (initialOffer?.grainType as "GKP" | "GKG") || emptyFields.grainType,
    districtId: initialOffer?.districtId || user?.district || emptyFields.districtId,
    totalVolumeKg: initialOffer ? String(initialOffer.totalVolumeKg) : emptyFields.totalVolumeKg,
    askPrice: paramAskPrice || (initialOffer ? String(initialOffer.askPrice) : emptyFields.askPrice),
    quality: paramQuality || (initialOffer?.quality !== null && initialOffer?.quality !== undefined ? String(initialOffer.quality) : emptyFields.quality),
    availableOn: initialOffer?.availableOn || emptyFields.availableOn,
    notes: initialOffer?.notes || emptyFields.notes,
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [review, setReview] = useState<OfferInput | null>(null);
  const [saved, setSaved] = useState<HarvestOffer | undefined>(initialOffer);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showRedAlertModal, setShowRedAlertModal] = useState(false);

  const busy = useRef(false);
  const request = useRef<{ fingerprint: string; id: string } | null>(null);
  const mutation = useOfferCommand();

  // Price benchmark reference
  const priceRef = PriceReferenceService.getReference(fields.grainType, user?.regency || "Subang");
  const numericPrice = Number(fields.askPrice.replace(/\D/g, "")) || 0;
  const evaluation = evaluatePriceLight({
    price: numericPrice,
    lowerBound: priceRef.lowerBound,
    upperBound: priceRef.upperBound,
    toleranceDelta: priceRef.toleranceDelta,
  });

  function validate(): OfferInput | null {
    const parseNum = (v: string) => (v.trim() ? Number(v.replace(",", ".")) : NaN);
    const parsed = offerInputSchema.safeParse({
      grainType: fields.grainType,
      province: user?.province || "Jawa Barat",
      regency: user?.regency || "Subang",
      districtId: fields.districtId,
      district: fields.districtId,
      farmerName: user?.name || user?.businessName || "Petani SAMBUNG",
      totalVolumeKg: parseNum(fields.totalVolumeKg),
      askPrice: Number(fields.askPrice.replace(/\D/g, "")),
      quality: fields.quality.trim() ? parseNum(fields.quality) : null,
      availableOn: fields.availableOn || null,
      notes: fields.notes.trim() || null,
    });

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message || "Periksa kembali isian formulir Anda."
      );
      return null;
    }
    setError("");
    return parsed.data;
  }

  function handleProceedToReview(e: FormEvent) {
    e.preventDefault();
    const input = validate();
    if (!input) return;

    if (evaluation.isRedAlert) {
      setShowRedAlertModal(true);
      return;
    }

    setReview(input);
    setStep(2);
  }

  function confirmRedAndProceed() {
    const input = validate();
    if (input) {
      setReview(input);
      setStep(2);
    }
  }

  async function command(value: OfferCommand) {
    const fingerprint = JSON.stringify(value);
    if (request.current?.fingerprint !== fingerprint) {
      request.current = { fingerprint, id: crypto.randomUUID() };
    }
    const result = await mutation.mutateAsync({
      command: value,
      requestId: request.current.id,
    });
    request.current = null;
    return result;
  }

  async function persist(input: OfferInput, publish: boolean) {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");

    try {
      let draft = saved;
      const unchanged =
        draft &&
        draft.grainType === input.grainType &&
        draft.districtId === input.districtId &&
        draft.totalVolumeKg === input.totalVolumeKg &&
        draft.askPrice === input.askPrice &&
        draft.quality === input.quality &&
        draft.availableOn === input.availableOn;

      if (!unchanged) {
        draft = await command(
          draft
            ? { action: "update", id: draft.id, version: draft.version, input }
            : { action: "create", input }
        );
        setSaved(draft);
      }

      if (!draft) throw new Error("Draf belum tersimpan.");

      if (publish) {
        const published = await command({
          action: "publish",
          id: draft.id,
          version: draft.version,
        });
        setSaved(published);
        setStep(3);
      } else {
        router.push("/petani/tawaran");
      }
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Gagal menyimpan tawaran. Silakan periksa kembali koneksi Anda."
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  const updateField = (key: keyof typeof emptyFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const volumeNum = Number(fields.totalVolumeKg.replace(",", ".")) || 0;
  const priceNum = Number(fields.askPrice.replace(/\D/g, "")) || 0;
  const estimatedTotal = volumeNum * priceNum;

  return (
    <div className="space-y-8">
      {/* Step Indicator Header */}
      <div>
        <Link
          href="/petani/tawaran"
          onClick={onBack}
          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Kembali ke Daftar Tawaran
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {step === 3
                ? "Tawaran Panen Berhasil Diterbitkan"
                : initialOffer
                ? "Perbarui Tawaran Panen"
                : "Pasang Tawaran Panen Baru"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {step === 1 && "Lengkapi data hasil panen dan sesuaikan harga dengan acuan pasar setempat."}
              {step === 2 && "Tinjau rincian komitmen pasokan sebelum ditayangkan ke katalog pembeli."}
              {step === 3 && "Tawaran Anda kini aktif dan siap menerima pesanan dari mitra pembeli."}
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-medium text-muted-foreground">
            <span>Tahap</span>
            <strong className="text-foreground">{step}</strong>
            <span>dari 3</span>
          </div>
        </div>
      </div>

      {/* Stepper Wizard Bar */}
      <nav aria-label="Tahapan Formulir" className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { num: 1, label: "Detail Panen & Harga" },
          { num: 2, label: "Tinjau Rincian" },
          { num: 3, label: "Penerbitan Selesai" },
        ].map((item) => (
          <div
            key={item.num}
            className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs font-medium transition ${
              step === item.num
                ? "border-emerald-500 bg-emerald-50/80 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700 shadow-xs"
                : step > item.num
                ? "border-emerald-300/80 bg-emerald-50/30 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300"
                : "border-border/80 bg-card text-foreground"
            }`}
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                step === item.num
                  ? "bg-emerald-600 text-white shadow-xs"
                  : step > item.num
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                  : "bg-muted text-foreground border border-border/80"
              }`}
            >
              {step > item.num ? "✓" : item.num}
            </span>
            <span className="truncate font-semibold">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Error Banner */}
      {error && (
        <div role="alert" className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Step 1: Form Input */}
      {step === 1 && (
        <form onSubmit={handleProceedToReview} className="space-y-8">
          <div className="grid items-start gap-6 lg:grid-cols-12">
            {/* Left Column: Harvest & Location Fields */}
            <div className="lg:col-span-7 space-y-6">
              <section className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-5">
                <div className="border-b border-border/60 pb-3">
                  <h2 className="text-base font-semibold text-foreground">
                    1. Rincian Komoditas & Volume
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tentukan jenis gabah dan taksiran tonase bersih panen Anda.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-1.5">
                    <span className="text-xs font-medium text-foreground block">
                      Jenis Gabah <span className="text-destructive">*</span>
                    </span>
                    <Select
                      items={GRAIN_TYPE_OPTIONS}
                      value={fields.grainType}
                      disabled={initialOffer?.typeLocationLocked}
                      onValueChange={(val) => {
                        if (val === "GKP" || val === "GKG") {
                          updateField("grainType", val);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Pilih jenis gabah" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRAIN_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-foreground">
                      Volume Bersih (kg) <span className="text-destructive">*</span>
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      required
                      value={fields.totalVolumeKg}
                      onChange={(e) => updateField("totalVolumeKg", e.target.value)}
                      placeholder="Contoh: 5000"
                      className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-xs text-muted-foreground block">
                      ≈ {(volumeNum / 1000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} ton
                    </span>
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-foreground">
                      Estimasi Mutu / Kadar Air (%)
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={fields.quality}
                      onChange={(e) => updateField("quality", e.target.value)}
                      placeholder="Contoh: 22.5"
                      className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-xs text-muted-foreground block">
                      Deklaratif petani (opsional)
                    </span>
                  </label>

                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-foreground block">
                      Lokasi Pengambilan (Kecamatan) <span className="text-destructive">*</span>
                    </span>
                    <Select
                      items={DISTRICT_SELECT_ITEMS}
                      value={fields.districtId}
                      disabled={initialOffer?.typeLocationLocked}
                      onValueChange={(val) => {
                        if (val) updateField("districtId", val);
                      }}
                    >
                      <SelectTrigger className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Pilih kecamatan" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISTRICT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-foreground">
                      Tanggal Panen / Siap Angkut
                    </span>
                    <input
                      type="date"
                      value={fields.availableOn}
                      onChange={(e) => updateField("availableOn", e.target.value)}
                      className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>
                </div>
              </section>

              {/* Price Range Slider Component */}
              <PriceRangeSlider
                value={numericPrice}
                min={5000}
                max={10000}
                lowerBound={priceRef.lowerBound}
                upperBound={priceRef.upperBound}
                toleranceDelta={priceRef.toleranceDelta}
                onChange={(newVal) => updateField("askPrice", String(newVal))}
                label={`2. Penetapan Harga Minta Gabah (${fields.grainType})`}
                description={`Geser atau ketik nominal harga per kilogram. Pantau indikator spektrum warna agar harga tetap bersaing.`}
              />
            </div>

            {/* Right Column: Dynamic Price Summary Card */}
            <div className="lg:col-span-5 space-y-6">
              <section className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Estimasi Nilai Total Pasokan
                </h3>

                <div className="rounded-xl bg-muted/40 p-4 border border-border/60">
                  <p className="text-xs text-muted-foreground">Perkiraan Nilai Kotor Pasokan</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                    {estimatedTotal > 0 ? formatRupiah(estimatedTotal) : "Rp0"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Dihitung dari {volumeNum.toLocaleString("id-ID")} kg × Rp{numericPrice.toLocaleString("id-ID")}/kg.
                  </p>
                </div>

                <div className="text-xs text-muted-foreground space-y-2 pt-2">
                  <p className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      Harga yang Anda masukkan akan ditampilkan langsung kepada pembeli di katalog pasar.
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      Pembeli berhak mengajukan negosiasi harga sebelum kesepakatan final disetujui bersama.
                    </span>
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Form Actions Footer */}
          <footer className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Tawaran Belum Diterbitkan
              </p>
              <p className="text-xs text-muted-foreground">
                Klik tombol di samping untuk meninjau ringkasan sebelum terbit ke pasar.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none min-h-11 px-5"
                disabled={pending}
                onClick={() => {
                  const input = validate();
                  if (input) void persist(input, false);
                }}
              >
                Simpan Draf
              </Button>
              <Button
                type="submit"
                className="flex-1 sm:flex-none min-h-11 px-6 font-semibold"
                disabled={pending}
              >
                {isMobile ? "Lanjut Tinjau" : "Lanjut Tinjau Tawaran"}
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </footer>
        </form>
      )}

      {/* Step 2: Review Offer */}
      {step === 2 && review && (
        <div className="space-y-8">
          <div className="grid items-start gap-6 lg:grid-cols-12">
            <section className="lg:col-span-7 rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-5">
              <div className="border-b border-border/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Tinjauan Akhir
                </span>
                <h2 className="text-lg font-bold text-foreground mt-0.5">
                  Rincian Komitmen Pasokan Gabah
                </h2>
                <p className="text-xs text-muted-foreground">
                  Periksa kembali seluruh data sebelum tawaran ini resmi dapat dipesan oleh pembeli.
                </p>
              </div>

              <OfferSummary input={review} />
            </section>

            <aside className="lg:col-span-5 rounded-2xl border border-border/80 bg-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                Ketentuan Kesepakatan Digital
              </h3>
              <ul className="text-xs text-muted-foreground space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>
                    Tawaran yang terbit akan tampil di katalog pasokan bagi pembeli terverifikasi.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>
                    Pembeli dapat memesan sebagian atau seluruh volume gabah Anda.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>
                    Nomor kontak dan identitas kedua belah pihak terlindungi dan baru dibuka secara otomatis setelah kesepakatan harga disetujui bersama.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>
                    Kesepakatan pada aplikasi mengikat komitmen volume dan harga. Serah terima gabah fisik serta pembayaran diselesaikan langsung di lapangan.
                  </span>
                </li>
              </ul>
            </aside>
          </div>

          <footer className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Siap Menayangkan Pasokan?
              </p>
              <p className="text-xs text-muted-foreground">
                Anda masih dapat menarik atau memperbarui tawaran selama belum ada pesanan aktif.
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-initial min-h-11 px-3 sm:px-4"
                disabled={pending}
                onClick={() => setStep(1)}
              >
                {isMobile ? "Ubah" : "Ubah Detail"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-initial min-h-11 px-3 sm:px-4"
                disabled={pending}
                onClick={() => void persist(review, false)}
              >
                {isMobile ? "Draf" : "Simpan Draf"}
              </Button>
              <Button
                type="button"
                className="flex-1 sm:flex-initial min-h-11 px-4 sm:px-6 font-semibold"
                disabled={pending}
                onClick={() => void persist(review, true)}
              >
                {pending
                  ? "Menerbitkan…"
                  : isMobile
                  ? "Terbitkan"
                  : "Terbitkan Tawaran Sekarang"}
              </Button>
            </div>
          </footer>
        </div>
      )}

      {/* Step 3: Success Confirmation */}
      {step === 3 && saved && (
        <section className="rounded-2xl border border-border/80 bg-card p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Tawaran Panen Berhasil Diterbitkan!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Tawaran Anda untuk gabah <strong>{saved.grainType}</strong> sebanyak{" "}
              <strong>{saved.totalVolumeKg.toLocaleString("id-ID")} kg</strong> kini telah aktif dan dapat dipesan oleh pembeli di platform SAMBUNG.
            </p>
          </div>

          <div className="pt-2">
            <OfferSummary input={saved} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              className="w-full sm:w-auto min-h-11 px-6"
              onClick={() => router.push("/petani/tawaran")}
            >
              {isMobile ? "Tawaran Saya" : "Buka Halaman Tawaran Saya"}
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto min-h-11 px-6"
              onClick={() => {
                setFields(emptyFields);
                setSaved(undefined);
                setReview(null);
                setStep(1);
              }}
            >
              {isMobile ? "Tawaran Lain" : "Pasang Tawaran Lain"}
            </Button>
          </div>
        </section>
      )}

      {/* Confirm Red Light Alert Dialog */}
      <ConfirmRedLightDialog
        open={showRedAlertModal}
        onOpenChange={setShowRedAlertModal}
        price={numericPrice}
        lowerBound={priceRef.lowerBound}
        upperBound={priceRef.upperBound}
        redThreshold={evaluation.redThreshold}
        onConfirm={confirmRedAndProceed}
      />
    </div>
  );
}
