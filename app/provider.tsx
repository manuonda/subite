'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { UbicacionProvider } from './context/UbicacionContext'
import { AccedidoProvider } from './context/AccedidoContext'
import { MapViewProvider } from './context/MapViewContext'

export function Providers({children} : {children: React.ReactNode}) {
    const [queryClient] = useState(() => new QueryClient());
    return  (
        <QueryClientProvider client={queryClient}>
            <AccedidoProvider>
                <UbicacionProvider>
                    <MapViewProvider>
                        {children}
                    </MapViewProvider>
                </UbicacionProvider>
            </AccedidoProvider>
        </QueryClientProvider>
    );
}