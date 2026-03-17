"use client";
import { useState, useRef } from "react";

interface BottomSheetProps {
  children: React.ReactNode;
  title?: string;
}

export function BottomSheet({ children, title }: BottomSheetProps) {
  const [expanded, setExpanded] = useState(false);
  const startY = useRef(0);
  const startExpanded = useRef(false);

  function handleTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY;
    startExpanded.current = expanded;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const deltaY = startY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > 40) {
      setExpanded(deltaY > 0);
    }
  }

  return (
    <div
      className={`
        fixed left-0 right-0 bottom-16 lg:hidden
        bg-white rounded-t-3xl shadow-2xl z-30
        transition-all duration-300 ease-out
        ${expanded ? "top-[10vh]" : "top-[55vh]"}
      `}
    >
      {/* Drag handle */}
      <div
        className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
        {title && (
          <p className="text-sm font-semibold text-gray-700 mt-2">{title}</p>
        )}
      </div>

      {/* Content */}
      <div className="overflow-y-auto no-scrollbar px-4 pb-4"
           style={{ height: "calc(100% - 48px)" }}>
        {children}
      </div>
    </div>
  );
}
