import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15]">
                    Transparansi Nilai Gabah,{" "}
                    <span className="text-primary underline decoration-primary/30 decoration-wavy">
                        Keadilan bagi Petani
                    </span>
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Platform transaksi digital yang mempertemukan Kelompok Tani dengan Pabrik Penggilingan melalui
                    acuan rentang harga wajar, lampu indikator harga, dan komitmen pasokan digital bebas komisi.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button
                        size="lg"
                        className="min-h-12 px-6 text-base font-semibold shadow-md cursor-pointer"
                        render={<Link href="/masuk" />}
                    >
                        Masuk / Mulai Bertransaksi
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="min-h-12 px-6 text-base font-medium cursor-pointer"
                        render={<Link href="/#rantai-harga" />}
                    >
                        Jelajahi Papan Rantai Harga
                    </Button>
                </div>
            </div>
        </section>
    )
}
