"use client";

import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export default function RealtimeProvider({ children }: { children: React.ReactNode }) {
    useRealtimeSync();
    return <>{children}</>;
}