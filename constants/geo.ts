// Coordenadas de Buenos Aires (centro AMBA)
export const BA_CENTER = { lat: -34.6037, lng: -58.3816 };

/**
 * Modo desarrollo: usar BA_CENTER en lugar del GPS real.
 * En .env: NEXT_PUBLIC_USE_BA_COORDS=true
 */
export const USE_BA_COORDS_DEV =
  typeof process !== "undefined" && process.env?.NEXT_PUBLIC_USE_BA_COORDS === "true";