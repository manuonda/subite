"use client";
import { useState, useRef, useEffect } from "react";

export type SheetState = "minimized" | "collapsed" | "expanded";

interface BottomSheetProps {
  children: React.ReactNode;
  title?: string;
  /** Contenido opcional entre el título y la lista (p. ej. banner de ubicación) */
  banner?: React.ReactNode;
  /** Estado inicial: por defecto minimizado para ver el mapa completo y abrir el sheet al tocar */
  initialState?: SheetState;
  onStateChange?: (state: SheetState) => void;
  /** Acceso rápido a la pestaña Subtes (estado minimizado) */
  onOpenSubtes?: () => void;
}

export function BottomSheet({
  children,
  title,
  banner,
  initialState = "minimized",
  onStateChange,
  onOpenSubtes,
}: BottomSheetProps) {
  const [state, setState] = useState<SheetState>(initialState);
  const startY = useRef(0);
  const startState = useRef<SheetState>(initialState);

  function handleTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY;
    startState.current = state;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const deltaY = startY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > 40) {
      if (deltaY > 0) {
        setState(startState.current === "minimized" ? "collapsed" : startState.current === "collapsed" ? "expanded" : "expanded");
      } else {
        setState(startState.current === "expanded" ? "collapsed" : startState.current === "collapsed" ? "minimized" : "minimized");
      }
    }
  }

  function handleClick() {
    if (state === "minimized") {
      setState("collapsed");
    } else {
      setState(state === "collapsed" ? "expanded" : "collapsed");
    }
  }

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  /** Minimizado: franja ~104px sobre el mapa (handle + texto + acceso Subtes); bottom-16 respeta la nav */
  const topPosition =
    state === "minimized"
      ? "calc(100dvh - 10.5rem)"
      : state === "collapsed"
        ? "52vh"
        : "12vh";

  return (
    <div
      className={`
        fixed left-0 right-0 bottom-16 lg:hidden
        bg-[var(--bg-surface)] rounded-t-3xl border-t border-[var(--border)] shadow-2xl z-[1100]
        transition-all duration-300 ease-out
        pointer-events-none
      `}
      style={{ top: topPosition }}
    >
      {/* Drag handle — click o arrastrar para expandir/colapsar/minimizar */}
      <div
        role="button"
        tabIndex={0}
        className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing min-h-[52px] pointer-events-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        aria-label={state === "minimized" ? "Expandir lista de paradas" : state === "collapsed" ? "Expandir" : "Colapsar"}
      >
        <div className="w-9 h-1 bg-white/20 rounded-full" />
        {title && state !== "minimized" && (
          <p className="text-[11px] font-medium text-[var(--text-dim)] uppercase tracking-[1.5px] mt-3 font-mono">
            {title}
          </p>
        )}
        {state === "minimized" ? (
          <p className="text-[10px] text-[var(--text-dim)] mt-2 text-center px-2">
            Tocá arriba para ver paradas cercanas
          </p>
        ) : null}
      </div>

      {state === "minimized" && onOpenSubtes ? (
        <div className="flex justify-center pb-2 px-3 -mt-1 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSubtes();
            }}
            className="text-[11px] font-medium text-[var(--primary)] underline-offset-2 hover:underline"
          >
            Ver líneas de subte
          </button>
        </div>
      ) : null}

      {/* Content — oculto cuando minimizado */}
      {state !== "minimized" && (
        <div
          className="flex flex-col min-h-0 no-scrollbar px-4 pb-4 pointer-events-auto"
          style={{ height: "calc(100% - 52px)" }}
        >
          {banner ? <div className="shrink-0 pb-3">{banner}</div> : null}
          <div className="overflow-y-auto flex-1 min-h-0">{children}</div>
        </div>
      )}
    </div>
  );
}
