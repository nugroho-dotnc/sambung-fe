"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Wheat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  ChevronRight,
  TrendingUp,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { AsyncBoundary } from "@/components/shared/async-boundary";
import { useOffers, useOfferCommand } from "../hooks/use-offers";
import { formatRupiah } from "./offer-summary";
import type { HarvestOffer } from "../schemas";

export function OffersWorkspace({
  initialId = null,
}: {
  initialId?: string | null;
}) {
  const router = useRouter();
  const { data: offers = [], isLoading, isError, error, refetch } = useOffers();
  const mutation = useOfferCommand();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  // Aggregate metrics (5 Volume Statuses)
  const metrics = useMemo(() => {
    return offers.reduce(
      (acc, item) => {
        acc.total += item.totalVolumeKg;
        acc.available += item.availableVolumeKg;
        acc.reserved += item.reservedVolumeKg;
        acc.approved += item.approvedVolumeKg;
        acc.completed += item.completedVolumeKg;
        return acc;
      },
      { total: 0, available: 0, reserved: 0, approved: 0, completed: 0 }
    );
  }, [offers]);

  // Filtered offers by status tab and search query
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // Tab filter
      if (activeTab === "published" && offer.status !== "published") return false;
      if (activeTab === "draft" && offer.status !== "draft") return false;
      if (activeTab === "withdrawn" && offer.status !== "withdrawn") return false;

      // Search query filter (matches commodity, location, id)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesGrain = offer.grainType.toLowerCase().includes(query);
        const matchesDistrict = (offer.district || offer.districtId || "").toLowerCase().includes(query);
        const matchesId = offer.id.toLowerCase().includes(query);
        return matchesGrain || matchesDistrict || matchesId;
      }

      return true;
    });
  }, [offers, activeTab, searchQuery]);

  async function handleWithdraw(offer: HarvestOffer) {
    try {
      await mutation.mutateAsync({
        command: {
          action: "withdraw",
          id: offer.id,
          version: offer.version,
        },
        requestId: crypto.randomUUID(),
      });
      setWithdrawingId(null);
    } catch {
      // Error handled by TanStack mutation
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Tawaran Panen Saya"
        description="Pantau pasokan gabah yang Anda daftarkan, alokasi tonase yang dipesan pembeli, dan kelola pembaruan harga."
        actions={
          <Button
            render={
              <Link href="/petani/jual">
                <Plus className="w-4 h-4 mr-2" />
                Pasang Tawaran Baru
              </Link>
            }
            className="min-h-11 px-5 font-semibold"
          />
        }
      />

      {/* 5 Volume Status Cards Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
        <Card className="rounded-2xl border-border/70 bg-card p-4">
          <p className="text-[11px] font-medium text-muted-foreground">Total Deklarasi Panen</p>
          <p className="text-xl font-bold font-mono tabular-nums text-foreground mt-1">
            {metrics.total.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-normal text-muted-foreground font-sans">kg</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">Seluruh tawaran aktif & draf</p>
        </Card>

        <Card className="rounded-2xl border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-4">
          <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">Volume Siap Dipesan</p>
          <p className="text-xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400 mt-1">
            {metrics.available.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-normal text-muted-foreground font-sans">kg</span>
          </p>
          <p className="text-[10px] text-emerald-800/80 dark:text-emerald-300/70 mt-1">Tersedia di katalog</p>
        </Card>

        <Card className="rounded-2xl border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 p-4">
          <p className="text-[11px] font-medium text-amber-800 dark:text-amber-300">Sedang Dinegosiasi</p>
          <p className="text-xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400 mt-1">
            {metrics.reserved.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-normal text-muted-foreground font-sans">kg</span>
          </p>
          <p className="text-[10px] text-amber-800/80 dark:text-amber-300/70 mt-1">Tertahan dalam pesanan</p>
        </Card>

        <Card className="rounded-2xl border-blue-500/30 bg-blue-50/40 dark:bg-blue-950/20 p-4">
          <p className="text-[11px] font-medium text-blue-800 dark:text-blue-300">Kesepakatan Sah</p>
          <p className="text-xl font-bold font-mono tabular-nums text-blue-700 dark:text-blue-400 mt-1">
            {metrics.approved.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-normal text-muted-foreground font-sans">kg</span>
          </p>
          <p className="text-[10px] text-blue-800/80 dark:text-blue-300/70 mt-1">Menunggu angkut gabah</p>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card p-4 col-span-2 sm:col-span-1">
          <p className="text-[11px] font-medium text-muted-foreground">Panen Telah Selesai</p>
          <p className="text-xl font-bold font-mono tabular-nums text-foreground mt-1">
            {metrics.completed.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-normal text-muted-foreground font-sans">kg</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">Tuntas serah terima</p>
        </Card>
      </div>

      {/* Tabs & Search Filter Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-muted/80 p-1 rounded-xl h-auto flex flex-wrap gap-1">
              <TabsTrigger value="all" className="min-h-9 px-3 text-xs rounded-lg">
                Semua ({offers.length})
              </TabsTrigger>
              <TabsTrigger value="published" className="min-h-9 px-3 text-xs rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Terbit ({offers.filter((o) => o.status === "published").length})
              </TabsTrigger>
              <TabsTrigger value="draft" className="min-h-9 px-3 text-xs rounded-lg">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                Draf ({offers.filter((o) => o.status === "draft").length})
              </TabsTrigger>
              <TabsTrigger value="withdrawn" className="min-h-9 px-3 text-xs rounded-lg">
                <Archive className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                Ditarik ({offers.filter((o) => o.status === "withdrawn").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari jenis atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 rounded-xl border border-input bg-background pl-9 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Content Area */}
        <AsyncBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
          isEmpty={filteredOffers.length === 0}
          emptyFallback={
            <div className="rounded-2xl border border-border/80 bg-card p-10 text-center space-y-3 my-4">
              <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                <Wheat className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {searchQuery ? "Tawaran Tidak Ditemukan" : "Belum Ada Tawaran yang Sesuai"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                {searchQuery
                  ? "Tidak ditemukan tawaran yang cocok dengan kata kunci pencarian Anda."
                  : activeTab === "all"
                  ? "Anda belum memiliki daftar tawaran panen. Pasang tawaran pertama Anda agar dapat dilihat oleh pembeli."
                  : "Tidak ada tawaran dengan status ini saat ini."}
              </p>
              {activeTab === "all" && !searchQuery && (
                <Button
                  render={
                    <Link href="/petani/jual">
                      <Plus className="w-4 h-4 mr-1.5" />
                      Pasang Tawaran Panen
                    </Link>
                  }
                  className="mt-3 min-h-10 text-xs"
                />
              )}
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            {filteredOffers.map((offer) => {
              const location = offer.district || offer.districtId || "Pagaden";
              const percentAvailable =
                offer.totalVolumeKg > 0
                  ? Math.round((offer.availableVolumeKg / offer.totalVolumeKg) * 100)
                  : 0;

              return (
                <Card
                  key={offer.id}
                  className="rounded-2xl border-border/80 bg-card p-5 sm:p-6 space-y-4 hover:border-foreground/20 transition-colors shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-foreground">
                          Gabah {offer.grainType}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({offer.grainType === "GKP" ? "Kering Panen" : "Kering Giling"})
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Kec. {location}, Kab. {offer.regency || "Subang"}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        offer.status === "published"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                          : offer.status === "draft"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {offer.status === "published"
                        ? "Terbit di Pasar"
                        : offer.status === "draft"
                        ? "Draf Tersimpan"
                        : "Telah Ditarik"}
                    </span>
                  </div>

                  {/* Price & Value Row */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-xs text-muted-foreground block">Harga Minta</span>
                      <p className="text-xl font-bold font-mono tabular-nums text-foreground">
                        {formatRupiah(offer.askPrice)}{" "}
                        <span className="text-xs font-normal text-muted-foreground font-sans">/ kg</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">Estimasi Nilai Total</span>
                      <p className="text-sm font-semibold font-mono tabular-nums text-foreground">
                        {formatRupiah(offer.askPrice * offer.totalVolumeKg)}
                      </p>
                    </div>
                  </div>

                  {/* Volume Allocation Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-mono tabular-nums">
                      <span className="text-muted-foreground">
                        Tersedia: <strong>{offer.availableVolumeKg.toLocaleString("id-ID")} kg</strong>
                      </span>
                      <span className="text-muted-foreground">
                        Total: {offer.totalVolumeKg.toLocaleString("id-ID")} kg
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${percentAvailable}%` }}
                        title={`Tersedia: ${percentAvailable}%`}
                      />
                      {offer.reservedVolumeKg > 0 && (
                        <div
                          className="bg-amber-400 h-full transition-all"
                          style={{
                            width: `${Math.round((offer.reservedVolumeKg / offer.totalVolumeKg) * 100)}%`,
                          }}
                          title="Dipesan (Dalam Proses)"
                        />
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      className="min-h-9 text-xs rounded-xl"
                      render={
                        <Link href={`/petani/tawaran/${offer.id}`}>
                          Lihat Detail & Pesanan
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      }
                    />

                    {offer.status !== "withdrawn" && (
                      <div className="flex items-center gap-2">
                        {withdrawingId === offer.id ? (
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="min-h-8 text-xs px-2.5"
                              disabled={mutation.isPending}
                              onClick={() => void handleWithdraw(offer)}
                            >
                              Yakin Tarik
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="min-h-8 text-xs px-2"
                              onClick={() => setWithdrawingId(null)}
                            >
                              Batal
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="min-h-8 text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => setWithdrawingId(offer.id)}
                          >
                            Tarik Tawaran
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </AsyncBoundary>
      </div>
    </PageContainer>
  );
}
