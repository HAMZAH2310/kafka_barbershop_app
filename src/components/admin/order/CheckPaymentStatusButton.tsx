"use client";

import { useState } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { Order } from "@/lib/orders";

interface Props {
    order: Order;
    compact?: boolean;
}

export default function CheckPaymentStatusButton({ order, compact = false }: Props) {
    const { syncPaymentStatus } = useOrderStore();
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);

    const midtransOrderId = order.midtransTransaction?.[0]?.midtransOrderId;

    const handleCheck = async () => {
        if (!midtransOrderId) return;

        setLoading(true);
        setFeedback(null);

        const result = await syncPaymentStatus(midtransOrderId);

        setFeedback({
            message: result.message || (result.success ? "Status diperbarui" : "Gagal mengecek"),
            success: result.success,
        });

        setLoading(false);

        setTimeout(() => {
            setFeedback(null);
        }, 4000);
    };

    // tidak ada transaksi Midtrans sama sekali untuk order ini, jangan tampilkan tombol
    if (!midtransOrderId) return null;

    return (
        <div className="inline-flex flex-col items-start relative">
            <button
                type="button"
                onClick={handleCheck}
                disabled={loading}
                title="Cek & sinkronkan status transaksi dari Midtrans"
                className={`inline-flex items-center gap-1.5 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border ${compact
                        ? "p-1 text-xs border-line hover:border-brass hover:text-brass text-muted bg-surface/50"
                        : "px-2.5 py-1 text-xs border-line hover:border-brass hover:text-brass text-muted bg-surface/50 hover:bg-ink/50"
                    }`}
            >
                <svg
                    className={`w-3.5 h-3.5 ${loading ? "animate-spin text-brass" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                </svg>
                {!compact && (
                    <span>{loading ? "Mengecek..." : "Cek Status"}</span>
                )}
            </button>

            {feedback && (
                <div
                    className={`absolute z-20 top-full mt-1 left-0 whitespace-nowrap text-[11px] px-2 py-0.5 rounded shadow-lg border animate-fade-in ${feedback.success
                            ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30"
                            : "bg-red-950/90 text-red-300 border-red-500/30"
                        }`}
                >
                    {feedback.message}
                </div>
            )}
        </div>
    );
}