"use client";

import { usePaymentStore } from "@/store/usePaymentStore";
import Button from "@/components/ui/Button";

interface Props {
    orderId: number;
}

export default function PayButton({ orderId }: Props) {
    const { payOrder, isProcessing, error } = usePaymentStore();

    return (
        <div>
            <Button
                className="text-xs px-3 py-1.5"
                onClick={() => payOrder(orderId)}
                disabled={isProcessing}
            >
                {isProcessing ? "Memproses..." : "Bayar Sekarang"}
            </Button>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    )
}