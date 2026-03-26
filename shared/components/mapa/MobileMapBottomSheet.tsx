"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocale } from "@/app/context/LocaleContext";

type SnapIndex = 0 | 1 | 2;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function nearestSnapIndex(heights: [number, number, number], h: number): SnapIndex {
  let idx: SnapIndex = 1;
  let dist = Infinity;
  heights.forEach((val, i) => {
    const d = Math.abs(val - h);
    if (d < dist) {
      dist = d;
      idx = i as SnapIndex;
    }
  });
  return idx;
}

interface MobileMapBottomSheetProps {
  /** Filtros Subtes / Bus / Paradas / Config */
  header: React.ReactNode;
  children: React.ReactNode;
  /** 0 = más mapa, 1 = medio, 2 = casi pantalla completa */
  initialSnapIndex?: SnapIndex;
}

/**
 * Panel inferior arrastrable (estilo Uber): mapa arriba, sheet con handle + contenido.
 * En Chrome móvil el arrastre usa listeners en `document` + `passive: false` para no perder el gesto.
 */
export function MobileMapBottomSheet({
  header,
  children,
  initialSnapIndex = 1,
}: MobileMapBottomSheetProps) {
  const { t } = useLocale();
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startH: number; pointerId: number } | null>(null);
  const snapHeightsRef = useRef<[number, number, number]>([200, 320, 520]);
  const [containerH, setContainerH] = useState(0);
  const [snapIndex, setSnapIndex] = useState<SnapIndex>(initialSnapIndex);
  const [sheetH, setSheetH] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const liveHRef = useRef(0);

  const snapHeights = useMemo((): [number, number, number] => {
    if (containerH <= 0) return [200, 320, 520];
    const minStrip = 52;
    const maxSheet = Math.max(120, containerH - minStrip);
    const minSheet = Math.min(Math.max(148, containerH * 0.24), maxSheet * 0.45);
    const h0 = clamp(containerH * 0.3, minSheet, maxSheet);
    const h1 = clamp(containerH * 0.52, minSheet + 24, maxSheet);
    const h2 = clamp(containerH * 0.9, minSheet + 48, maxSheet);
    return [h0, h1, h2];
  }, [containerH]);

  useLayoutEffect(() => {
    snapHeightsRef.current = snapHeights;
  }, [snapHeights]);

  useLayoutEffect(() => {
    const el = sheetRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContainerH(el.getBoundingClientRect().height);
    });
    ro.observe(el);
    setContainerH(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (containerH <= 0 || dragging) return;
    const [h0, h1, h2] = snapHeights;
    const h = snapIndex === 0 ? h0 : snapIndex === 1 ? h1 : h2;
    liveHRef.current = h;
    setSheetH(h);
  }, [containerH, snapIndex, snapHeights, dragging]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const heights = snapHeightsRef.current;
      const h = sheetH ?? heights[snapIndex];
      const pointerId = e.pointerId;
      dragRef.current = { startY: e.clientY, startH: h, pointerId };
      setDragging(true);

      const move = (ev: PointerEvent) => {
        if (!dragRef.current || ev.pointerId !== dragRef.current.pointerId) return;
        ev.preventDefault();
        const { startY, startH } = dragRef.current;
        const dy = startY - ev.clientY;
        const [a, , c] = snapHeightsRef.current;
        const next = clamp(startH + dy, a, c);
        liveHRef.current = next;
        setSheetH(next);
      };

      const up = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
        document.removeEventListener("pointercancel", up);
        dragRef.current = null;
        setDragging(false);
        const h = liveHRef.current;
        const idx = nearestSnapIndex(snapHeightsRef.current, h);
        setSnapIndex(idx);
        const snapped = snapHeightsRef.current[idx];
        liveHRef.current = snapped;
        setSheetH(snapped);
      };

      document.addEventListener("pointermove", move, { passive: false });
      document.addEventListener("pointerup", up);
      document.addEventListener("pointercancel", up);
    },
    [sheetH, snapIndex],
  );

  const heightPx = sheetH ?? snapHeights[snapIndex];

  return (
    <div
      ref={sheetRef}
      className="lg:hidden flex flex-col shrink-0 overflow-hidden rounded-t-[1.75rem] border-t border-[var(--border)] bg-[var(--bg-surface)] z-[60] shadow-[0_-12px_40px_rgba(0,0,0,0.45)] isolate"
      style={{
        height: heightPx,
        touchAction: dragging ? "none" : "auto",
        transition: dragging ? "none" : "height 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      {/* Handle — arrastre vertical (document listeners en onPointerDown) */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={snapIndex >= 1}
        aria-label={t("sheetDragHandle")}
        className="flex flex-col items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing shrink-0 touch-none select-none"
        style={{ WebkitUserSelect: "none", WebkitTapHighlightColor: "transparent" }}
        onPointerDown={onPointerDown}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "PageUp") {
            e.preventDefault();
            setSnapIndex((i) => (i < 2 ? ((i + 1) as SnapIndex) : i));
          }
          if (e.key === "ArrowDown" || e.key === "PageDown") {
            e.preventDefault();
            setSnapIndex((i) => (i > 0 ? ((i - 1) as SnapIndex) : i));
          }
        }}
      >
        <div className="w-10 h-1 rounded-full bg-[var(--text-dim)] opacity-50" aria-hidden />
      </div>

      <div className="shrink-0 min-h-0 overflow-hidden touch-auto">{header}</div>

      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y px-4 py-3"
        style={{
          scrollbarWidth: "thin",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
        }}
      >
        {children}
      </div>
    </div>
  );
}
