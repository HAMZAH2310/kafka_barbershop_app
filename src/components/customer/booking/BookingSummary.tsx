"use client";

import { useBookingStore } from "@/store/useBookingStore";
import { formatRupiah } from "@/lib/format";

export default function BookingSummary() {
    const { selectedServices } = useBookingStore();

    if (selectedServices.length === 0) return null;

    const total = selectedServices.reduce((sum, s) => sum + s.price * s.qty, 0);

    return (
        <div className="border-t border-line pt-4 mt-4">
            {selectedServices.map((s) => (
                <div key={s.serviceId} className="flex justify-between text-sm text-muted mb-1">
                    <span>{s.name} x{s.qty}</span>
                    <span>{formatRupiah(s.price * s.qty)}</span>
                </div>
            ))}
            <div className="flex justify-between text-ivory font-medium mt-2 pt-2 border-t border-line">
                <span>Total</span>
                <span className="font-mono text-brass">{formatRupiah(total)}</span>
            </div>
        </div>
    );
}