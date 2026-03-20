"use client";
import { useState, useEffect, useCallback } from "react";
import { BA_CENTER } from "@/constants/geo";

export type GPSStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable";

export interface GPSState {
  status: GPSStatus;
  coords: { lat: number; lng: number } | null;
  error: string | null;
  requestPermission: () => void;
}

export function useGPS(): GPSState {
  const [status, setStatus] = useState<GPSStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      setError("Geolocalización no disponible en este dispositivo");
      setCoords(BA_CENTER);
      return;
    }

    setStatus("requesting");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStatus("granted");
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError(null);
      },
      (err) => {
        setStatus("denied");
        setError(err.message);
        setCoords(BA_CENTER);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    // Check existing permission
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          requestPermission();
        } else if (result.state === "denied") {
          setStatus("denied");
          setCoords(BA_CENTER);
        }
      });
    }
  }, [requestPermission]);

  return { status, coords, error, requestPermission };
}
