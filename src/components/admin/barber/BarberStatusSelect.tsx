"use client";

import { useBarberStore } from "@/store/useBarberStore";
import { BarberStatus } from "@/lib/barbers";
import { barberStatusColor } from "@/lib/barberStatus";

interface Props {
    barberId: number;
    currentStatus: BarberStatus;
}

const OPTIONS: { value: BarberStatus; label: string }[] = [
    { value: "available", label: "Tersedia" },
    { value: "working", label: "Sedang Kerja" },
    { value: "on_break", label: "Istirahat" },
];

export default function BarberStatusSelect({ barberId, currentStatus }: Props) {
    const { updateStatus } = useBarberStore();

    return (
        <select
            value={currentStatus}
            onChange={(e) => {
                console.log("onChange terpanggil", barberId, e.target.value);
                updateStatus(barberId, e.target.value as BarberStatus);
            }}
            className={`text-xs rounded-full border px-2.5 py-1 bg-transparent cursor-pointer focus:outline-none ${barberStatusColor(currentStatus)}`}
        >
            {OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-surface text-ivory">
                    {opt.label}
                </option>
            ))}
        </select>
    );
}