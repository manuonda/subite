"use client";
import { useState } from "react";
import { ChipsAccesoRapido } from "./ChipsAccesoRapido";
import { SearchIcon } from "./Icons";

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
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <SearchIcon size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar línea o calle..."
          className="w-full h-12 pl-10 pr-4 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      {query.length === 0 && <ChipsAccesoRapido onSelect={handleSearch} />}

      {resultados.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Resultados</h3>
          {resultados.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
              <p className="text-sm text-gray-800">{r}</p>
            </div>
          ))}
        </div>
      )}

      {query.length >= 2 && resultados.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">Sin resultados para "{query}"</p>
      )}
    </div>
  );
}
