"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Wheat,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ScrollText,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { AsyncBoundary } from "@/components/shared/async-boundary";
import { useOffers, useOfferCommand } from "../hooks/use-offers";
import { formatRupiah } from "./offer-summary";
import { PriceRangeSlider, PriceReferenceService } from "@/features/price-check";
import type { HarvestOffer } from "../schemas";

export function OfferDetailView({ offerId }: { offerId: string }) {
  const router = useRouter();
  const { data: offers = [], isLoading, isError, error, refetch } = useOffers();
  const mutation = useOfferCommand();

  const offer = offers.find((o) => o.id === offerId);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(offer?.askPrice || 7000);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);

  const priceRef = PriceReferenceService.getReference(offer?.grainType || "GKP", offer?.regency || "Subang");

  async function handlePriceUpdate() {
    if (!offer) return;
    try {
      await mutation.mutateAsync({
        command: {
          action: "update",
          id: offer.id,
          version: offer.version,
          input: {
            grainType: offer.grainType,
            province: offer.province,
            regency: offer.regency,
            districtId: offer.districtId,
            district: offer.district,
            totalVolumeKg: offer.totalVolumeKg,
            askPrice: newPrice,
            quality: offer.quality,
            availableOn: offer.availableOn,
            notes: offer.notes,
          },
        },
        requestId: crypto.randomUUID(),
      });
      setIsEditingPrice(false);
    } catch {
      // Handled by mutation
    }
  }

  async function handleWithdraw() {
    if (!offer) return;
    try {
      await mutation.mutateAsync({
        command: {
          action: "withdraw",
          id: offer.id,
          version: offer.version,
        },
        requestId: crypto.randomUUID(),
      });
      setConfirmWithdraw(false);
    } catch {
      // Handled by mutation
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <p className="text-xs text-muted-foreground">Memuat rincian tawaran...</p>
      </PageContainer>
    );
  }

  if (!offer) {
    return (
      <PageContainer>
        <div className="rounded-2xl border border-dashed p-12 text-center space-y-3">
          <h2 className="text-lg font-bold text-foreground">Tawaran Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground">
            Tawaran panen dengan ID #{offerId} tidak ditemukan atau bukan milik akun Anda.
          </p>
          <Button
            render={<Link href="/petani/tawaran">Kembali ke Daftar Tawaran</Link>}
            className="mt-3 min-h-10 text-xs"
          />
        </div>
      </PageContainer>
    );
  }

  const location = offer.district || offer.districtId || "Pagaden";

  return (
    <PageContainer>
      <Link
        href="/petani/tawaran"
        className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
        Kembali ke Daftar Tawaran Panen
      </Link>

      <PageHeader
        title={`Gabah ${offer.grainType} — #${offer.id}`}
        description={`Kec. ${location}, Kab. ${offer.regency || "Subang"} • Terdaftar sejak ${
          offer.createdAt ? new Date(offer.createdAt).toLocaleDateString("id-ID") : "Hari ini"
        }`}
        badge={
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              offer.status === "published"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                : offer.status === "draft"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {offer.status === "published"
              ? "Aktif di Pasar"
              : offer.status === "draft"
              ? "Draf Tersimpan"
              : "Telah Ditarik"}
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12 mb-8">
        {/* Left Column: Volume and Details */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="rounded-2xl border-border/80 bg-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-foreground border-b border-border/60 pb-3">
              Alokasi & Volume Panen
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-[11px] text-muted-foreground block">Total Volume</span>
                <span className="text-lg font-bold font-mono tabular-nums text-foreground">
                  {offer.totalVolumeKg.toLocaleString("id-ID")}{" "}
                  <span className="text-xs font-normal text-muted-foreground font-sans">kg</span>
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20">
                <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block">Volume Tersedia</span>
                <span className="text-lg font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                  {offer.availableVolumeKg.toLocaleString("id-ID")}{" "}
                  <span className="text-xs font-normal text-muted-foreground font-sans">kg</span>
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-500/20">
                <span className="text-[11px] text-amber-800 dark:text-amber-300 block">Tertahan (Nego)</span>
                <span className="text-lg font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400">
                  {offer.reservedVolumeKg.toLocaleString("id-ID")}{" "}
                  <span className="text-xs font-normal text-muted-foreground font-sans">kg</span>
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Kadar Air / Mutu</span>
                <span className="font-semibold text-foreground">
                  {offer.quality !== null ? `${offer.quality}% (Deklarasi)` : "Belum diukur"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Lokasi Pengambilan</span>
                <span className="font-semibold text-foreground">
                  Kec. {location}, Kab. {offer.regency || "Subang"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Estimasi Tanggal Panen</span>
                <span className="font-semibold text-foreground">
                  {offer.availableOn
                    ? new Date(offer.availableOn).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Tersedia Langsung"}
                </span>
              </div>
            </div>
          </Card>

          {/* Price Adjustment Card */}
          <Card className="rounded-2xl border-border/80 bg-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Harga Minta Penjualan
                </h2>
                <p className="text-xs text-muted-foreground">
                  Harga per kilogram yang dilihat pembeli di katalog pasar.
                </p>
              </div>
              {offer.status === "published" && !isEditingPrice && (
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-9 text-xs"
                  onClick={() => {
                    setNewPrice(offer.askPrice);
                    setIsEditingPrice(true);
                  }}
                >
                  Perbarui Harga
                </Button>
              )}
            </div>

            {!isEditingPrice ? (
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-foreground">
                    {formatRupiah(offer.askPrice)}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">/ kg</span>
                </div>
                <div className="text-right text-xs">
                  <span className="text-muted-foreground block">Rentang Acuan Pasar</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                    Rp{priceRef.lowerBound.toLocaleString("id-ID")} – Rp{priceRef.upperBound.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <PriceRangeSlider
                  value={newPrice}
                  lowerBound={priceRef.lowerBound}
                  upperBound={priceRef.upperBound}
                  toleranceDelta={priceRef.toleranceDelta}
                  onChange={setNewPrice}
                  label="Pilih Nominal Harga Baru"
                />
                <div className="flex items-center gap-2 justify-end pt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="min-h-9 text-xs"
                    onClick={() => setIsEditingPrice(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    size="sm"
                    className="min-h-9 text-xs font-semibold"
                    disabled={mutation.isPending}
                    onClick={() => void handlePriceUpdate()}
                  >
                    {mutation.isPending ? "Menyimpan…" : "Simpan Harga Baru"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Actions & Policy Info */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-2xl border-border/80 bg-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-primary" />
              Pesanan Terkait Tawaran Ini
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Jika ada pembeli yang mengajukan pesanan atas gabah ini, lembar kesepakatan akan terhubung langsung di panel Kontrak & Kesepakatan.
            </p>
            <Button
              variant="outline"
              className="w-full min-h-10 text-xs justify-between"
              render={
                <Link href="/kontrak">
                  Buka Menu Kontrak & Negosiasi
                  <ChevronRight className="w-4 h-4" />
                </Link>
              }
            />
          </Card>

          {/* Withdraw Offer Action */}
          {offer.status !== "withdrawn" && (
            <Card className="rounded-2xl border-destructive/30 bg-card p-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Tarik Tawaran dari Pasar
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Menarik tawaran akan menghapusnya dari katalog pasar pembeli. Tawaran yang ditarik tidak dapat dipesan lagi.
              </p>

              {confirmWithdraw ? (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-destructive">
                    Apakah Anda yakin ingin menarik tawaran ini?
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="min-h-9 text-xs"
                      disabled={mutation.isPending}
                      onClick={() => void handleWithdraw()}
                    >
                      Ya, Tarik Sekarang
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="min-h-9 text-xs"
                      onClick={() => setConfirmWithdraw(false)}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-9 text-xs text-destructive hover:bg-destructive/10"
                  onClick={() => setConfirmWithdraw(true)}
                >
                  Tarik Tawaran Ini
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
