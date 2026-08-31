"use client";

import { useState } from "react";
import { useOrderStore } from "@/store/useOrderStore";

interface Props {
    orderId: number;
    serviceStatus: "waiting" | "in_service" | "completed" | "cancelled";
}

export default function CancelOrderButton({ orderId, serviceStatus }: Props) {
    const { cancelOrder } = useOrderStore();
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    // cuma bisa dibatalkan kalau masih waiting/in_service
    if (serviceStatus !== "waiting" && serviceStatus !== "in_service") {
        return null;
    }

    const handleCancel = async () => {
        const confirmed = confirm("Yakin ingin membatalkan order ini? Aksi ini tidak bisa diurungkan.");
        if (!confirmed) return;

        setLoading(true);
        setFeedback("");

        const result = await cancelOrder(orderId);

        if (result.message) {
            setFeedback(result.message);
            setTimeout(() => setFeedback(""), 4000);
        }

        setLoading(false);
    };

    return (
        <div>
            <button
                onClick={handleCancel}
                disabled={loading}
                className="text-red-400/70 hover:text-red-400 text-xs transition-colors disabled:opacity-50"
            >
                {loading ? "Membatalkan..." : "Batalkan"}
            </button>
            {feedback && (
                <p className="text-[11px] text-brass mt-1 max-w-[180px]">{feedback}</p>
            )}
        </div>
    );
}