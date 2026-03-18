"use client";
import { useState, useRef } from "react";

type SheetState = "minimized" | "collapsed" | "expanded";

interface BottomSheetProps {
  children: React.ReactNode;
  title?: string;
}

export function BottomSheet({ children, title }: BottomSheetProps) {
  const [state, setState] = useState<SheetState>("collapsed");
  const startY = useRef(0);
  const startState = useRef<SheetState>("collapsed");

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

  const topPosition =
    state === "minimized" ? "calc(100vh - 112px)" : // 64px nav + 48px bar
    state === "collapsed" ? "55vh" : "10vh";

  return (
    <div
      className={`
        fixed left-0 right-0 bottom-16 lg:hidden
        bg-[var(--bg-surface)] rounded-t-3xl border-t border-[var(--border)] shadow-2xl z-30
        transition-all duration-300 ease-out
      `}
      style={{ top: topPosition }}
    >
      {/* Drag handle — click o arrastrar para expandir/colapsar/minimizar */}
      <div
        role="button"
        tabIndex={0}
        className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing min-h-[52px]"
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
        {state === "minimized" && (
          <p className="text-[10px] text-[var(--text-dim)] mt-2">Tocá para ver paradas</p>
        )}
      </div>

      {/* Content — oculto cuando minimizado */}
      {state !== "minimized" && (
        <div className="overflow-y-auto no-scrollbar px-4 pb-4"
             style={{ height: "calc(100% - 52px)" }}>
          {children}
        </div>
      )}
    </div>
  );
}
