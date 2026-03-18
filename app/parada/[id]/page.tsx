"use client";
import { use } from "react";
import Link from "next/link";
import { Mapa } from "@/app/components/Mapa";
import { ProximosArribos } from "@/app/components/ProximosArribos";
import { BackIcon } from "@/app/components/Icons";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ParadaPage({ params }: Props) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[var(--bg-app)] border-b border-[var(--border)] flex items-center px-4 z-40 gap-3">
        <Link href="/" className="text-[var(--text-muted)] active:text-[var(--primary)] transition-colors">
          <BackIcon size={20} />
        </Link>
        <h1 className="font-semibold text-[var(--text-primary)] text-sm truncate">Parada {id}</h1>
      </header>

      <div className="pt-14">
        {/* Mini map */}
        <div style={{ height: "200px" }}>
          <Mapa lat={-34.6037} lng={-58.3816} height="200px" zoom={16} />
        </div>

        {/* Próximos arribos */}
        <div className="mt-4">
          <ProximosArribos paradaId={id} />
        </div>
      </div>
    </div>
  );
}
