"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "suba_accedido";

type AccedidoContextType = {
  hasAccedido: boolean;
  setHasAccedido: (v: boolean) => void;
  acceder: () => void;
};

const AccedidoContext = createContext<AccedidoContextType | null>(null);

function getInitialAccedido(): boolean {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(STORAGE_KEY) === "true";
  }
  return false;
}

export function AccedidoProvider({ children }: { children: ReactNode }) {
  const [hasAccedido, setHasAccedido] = useState(getInitialAccedido);

  useEffect(() => {
    if (hasAccedido && typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "true");
    }
  }, [hasAccedido]);

  const acceder = useCallback(() => {
    setHasAccedido(true);
  }, []);

  return (
    <AccedidoContext.Provider value={{ hasAccedido, setHasAccedido, acceder }}>
      {children}
    </AccedidoContext.Provider>
  );
}

export function useAccedido() {
  const ctx = useContext(AccedidoContext);
  if (!ctx) throw new Error("useAccedido debe usarse dentro de AccedidoProvider");
  return ctx;
}
