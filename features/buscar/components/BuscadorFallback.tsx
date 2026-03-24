"use client";
import { useState } from "react";
import { ChipsAccesoRapido } from "./ChipsAccesoRapido";
import { SearchIcon } from "@/shared/components/ui/Icons";

export function BuscadorFallback() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<string[]>([]);

  function handleSearch(q: string) {
    setQuery(q);
    if (q.length < 2) {
      setResultados([]);
      return;
    }
    // Mock search
    const mock = ["Línea 60 — Palermo", "Línea 60 — Constitución", "Línea 12 — Centro", "Subte B — Uruguay"];
    setResultados(mock.filter((r) => r.toLowerCase().includes(q.toLowerCase())));
  }

  return (
    <div className="px-4 pt-4">
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          <SearchIcon size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar línea o calle..."
          className="w-full h-12 pl-10 pr-4 bg-white/5 border border-[var(--border)] rounded-2xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-muted)] transition-all"
        />
      </div>

      {query.length === 0 && <ChipsAccesoRapido onSelect={handleSearch} />}

      {resultados.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide mb-3">Resultados</h3>
          {resultados.map((r, i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-4 border border-[var(--border)] mb-3">
              <p className="text-sm text-[var(--text-primary)]">{r}</p>
            </div>
          ))}
        </div>
      )}

      {query.length >= 2 && resultados.length === 0 && (
        <p className="text-center text-[var(--text-muted)] text-sm mt-8">Sin resultados para &quot;{query}&quot;</p>
      )}
    </div>
  );
}
