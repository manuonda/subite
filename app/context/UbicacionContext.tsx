"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type UbicacionContextType = {
  /** True cuando el usuario está fuera del AMBA */
  fueraDelArea: boolean;
  setFueraDelArea: (v: boolean) => void;
  /** Ya mostramos el alert para no repetir */
  alertFueraDelAreaMostrado: boolean;
  marcarAlertMostrado: () => void;
};

const UbicacionContext = createContext<UbicacionContextType | null>(null);

export function UbicacionProvider({ children }: { children: ReactNode }) {
  const [fueraDelArea, setFueraDelArea] = useState(false);
  const [alertFueraDelAreaMostrado, setAlertFueraDelAreaMostrado] = useState(false);

  const marcarAlertMostrado = useCallback(() => {
    setAlertFueraDelAreaMostrado(true);
  }, []);

  return (
    <UbicacionContext.Provider
      value={{
        fueraDelArea,
        setFueraDelArea,
        alertFueraDelAreaMostrado,
        marcarAlertMostrado,
      }}
    >
      {children}
    </UbicacionContext.Provider>
  );
}

export function useUbicacion() {
  const ctx = useContext(UbicacionContext);
  if (!ctx) throw new Error("useUbicacion debe usarse dentro de UbicacionProvider");
  return ctx;
}
