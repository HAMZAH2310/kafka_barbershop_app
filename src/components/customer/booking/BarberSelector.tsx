"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { useBarberStore } from "@/store/useBarberStore";
import { Barber } from "@/lib/barbers";
import { barberStatusLabel, barberStatusColor } from "@/lib/barberStatus";

interface Props {
    initialBarbers: Barber[];
}

export default function BarberSelector({ initialBarbers }: Props) {
    const { selectedBarberId, selectBarber } = useBookingStore();
    const { barbers = [], setBarbers } = useBarberStore();

    useState(() => {
        setBarbers(initialBarbers);
    });

    const availableBarbers = barbers.filter((b) => b.status !== "on_break");

    if (availableBarbers.length === 0) {
        return (
            <p className="text-muted text-sm py-6 text-center">
                Semua barber sedang istirahat. Coba lagi beberapa saat.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableBarbers.map((barber) => {
                const isSelected = selectedBarberId === barber.id;

                return (
                    <button
                        key={barber.id}
                        type="button"
                        onClick={() => selectBarber(barber.id)}
                        className={`text-left bg-surface border rounded-lg p-3 transition-colors ${isSelected ? "border-brass" : "border-line hover:border-line/60"
                            }`}
                    >
                        <div className="w-full aspect-square rounded-md bg-ink border border-line overflow-hidden mb-2">
                            {barber.picture && (
                                <img src={barber.picture} alt={barber.name} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <p className="text-ivory text-sm font-medium">{barber.name}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] border transition-colors ${barberStatusColor(barber.status)}`}>
                            {barberStatusLabel[barber.status]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}