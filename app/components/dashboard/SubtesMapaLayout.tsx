"use client";

import { BottomSheet } from "@/shared/components/shell/BottomSheet";

interface SubtesMapaLayoutProps {
  map: React.ReactNode;
  children: React.ReactNode;
  title?: string;
}

export function SubtesMapaLayout({ map, children, title = "Líneas de subte" }: SubtesMapaLayoutProps) {
  return (
    <div
      className="flex flex-col lg:flex-row lg:min-h-0
        h-[calc(100dvh-7.5rem-env(safe-area-inset-bottom,0px))]
        lg:h-[calc(100dvh-3.5rem)]"
    >
      {/* Map area */}
      <div className="relative bg-[var(--bg-elevated)] w-full min-h-0 flex-1 lg:flex-1 lg:min-h-[280px]">
        {map}
      </div>

      {/* Desktop: side panel with list */}
      <aside className="hidden lg:flex flex-col w-full max-w-[440px] lg:w-[min(420px,38vw)] shrink-0 border-t lg:border-t-0 lg:border-l border-[var(--border)] bg-[var(--bg-surface)] min-h-0 max-h-[calc(100dvh-3.5rem)]">
        <div className="px-4 pt-4 pb-2 border-b border-[var(--border)] shrink-0">
          <h2 className="text-[11px] font-medium text-[var(--text-dim)] uppercase tracking-[1.5px] font-mono">
            {title}
          </h2>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-4 pt-3">
          {children}
        </div>
      </aside>

      {/* Mobile: bottom sheet with list */}
      <BottomSheet title={title} initialState="collapsed">
        {children}
      </BottomSheet>
    </div>
  );
}
