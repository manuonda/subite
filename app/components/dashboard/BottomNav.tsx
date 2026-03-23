"use client";
import { MapIcon } from "@/app/components/Icons";

export type TabId = "mapa" | "subtes" | "buscar";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS = [
  { id: "mapa" as TabId, label: "Mapa", Icon: MapIcon },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-surface)] border-t border-[var(--border)] z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="flex h-16">
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive ? "text-[var(--primary)]" : "text-white/40"
                  }`}
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] bg-[var(--bg-app)] border-r border-[var(--border)] z-50 pt-4">
        <div className="px-4 mb-6">
          <h1 className="text-xl font-bold text-[var(--primary)]">Subite</h1>
          <p className="text-xs text-[var(--text-muted)]">Transporte AMBA</p>
        </div>
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-colors ${isActive
                  ? "bg-[var(--primary-muted)] text-[var(--primary)] font-medium"
                  : "text-[var(--text-muted)] hover:bg-white/5"
                }`}
            >
              <Icon size={20} />
              <span className="text-sm">{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
