"use client";

import { MoonIcon, SunIcon } from "@/shared/components/ui/Icons";
import { useTheme } from "@/app/context/ThemeContext";

interface ThemeToggleButtonProps {
  className?: string;
  size?: "sm" | "md";
}

export function ThemeToggleButton({ className = "", size = "md" }: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme();
  const dim = size === "sm" ? "w-9 h-9" : "w-10 h-10";
  const icon = size === "sm" ? 16 : 18;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`${dim} rounded-xl flex items-center justify-center shrink-0
        border border-[var(--border)] bg-[var(--bg-elevated)]/80
        active:scale-[0.97] transition-transform hover:bg-[var(--primary-muted)] ${className}`}
      style={{ color: "var(--text-muted)" }}
      aria-label={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"}
      title={theme === "dark" ? "Tema claro" : "Tema oscuro"}
    >
      {theme === "dark" ? (
        <SunIcon size={icon} className="text-[var(--accent-amber)]" />
      ) : (
        <MoonIcon size={icon} className="text-[var(--primary)]" />
      )}
    </button>
  );
}
