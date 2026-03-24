"use client";

import type { HorarioTerminal } from "@/lib/subte";

interface HorariosLineaTableProps {
  horarios: HorarioTerminal[];
  color: string;
}

export function HorariosLineaTable({ horarios, color }: HorariosLineaTableProps) {
  if (horarios.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">No hay horarios disponibles.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)]" style={{ background: "var(--bg-elevated)" }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th
              className="text-left p-3 font-bold text-black"
              style={{ background: "#FACC15", width: "1%" }}
            >
              Terminal
            </th>
            <th
              colSpan={2}
              className="text-center p-2 font-bold text-black"
              style={{ background: "#FACC15" }}
            >
              LUNES A VIERNES
            </th>
            <th
              colSpan={2}
              className="text-center p-2 font-bold text-black"
              style={{ background: "#FACC15" }}
            >
              SÁBADOS
            </th>
            <th
              colSpan={2}
              className="text-center p-2 font-bold text-black"
              style={{ background: "#FACC15" }}
            >
              DOMINGOS Y FERIADOS
            </th>
          </tr>
          <tr>
            <th className="p-2" />
            <th className="p-1.5 text-xs font-semibold text-[var(--text-dim)]" style={{ background: "rgba(56,189,248,0.2)" }}>
              Primero
            </th>
            <th className="p-1.5 text-xs font-semibold text-[var(--text-dim)]" style={{ background: "rgba(56,189,248,0.2)" }}>
              Último
            </th>
            <th className="p-1.5 text-xs font-semibold text-[var(--text-dim)]" style={{ background: "rgba(56,189,248,0.2)" }}>
              Primero
            </th>
            <th className="p-1.5 text-xs font-semibold text-[var(--text-dim)]" style={{ background: "rgba(56,189,248,0.2)" }}>
              Último
            </th>
            <th className="p-1.5 text-xs font-semibold text-[var(--text-dim)]" style={{ background: "rgba(56,189,248,0.2)" }}>
              Primero
            </th>
            <th className="p-1.5 text-xs font-semibold text-[var(--text-dim)]" style={{ background: "rgba(56,189,248,0.2)" }}>
              Último
            </th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((h, i) => (
            <tr
              key={h.terminal}
              className="border-t border-[var(--border)]"
              style={{ background: i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent" }}
            >
              <td className="p-3 font-semibold text-[var(--text-primary)]">
                {h.terminal}
              </td>
              <td className="p-2 text-center font-mono text-[var(--text-primary)]">
                {h.lunVie.primero}
              </td>
              <td className="p-2 text-center font-mono text-[var(--text-primary)]">
                {h.lunVie.ultimo}
              </td>
              <td className="p-2 text-center font-mono text-[var(--text-primary)]">
                {h.sab.primero}
              </td>
              <td className="p-2 text-center font-mono text-[var(--text-primary)]">
                {h.sab.ultimo}
              </td>
              <td className="p-2 text-center font-mono text-[var(--text-primary)]">
                {h.dom.primero}
              </td>
              <td className="p-2 text-center font-mono text-[var(--text-primary)]">
                {h.dom.ultimo}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
