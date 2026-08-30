"use client";

import { useBookingStore } from "@/store/useBookingStore";
import { Service } from "@/lib/service";
import { formatRupiah, formatDuration } from "@/lib/format";

interface Props {
    services: Service[];
}

export default function ServiceSelector({ services }: Props) {
    const { selectedServices, toggleService, updateQty } = useBookingStore();

    if (services.length === 0) {
        return <p className="text-muted text-sm py-6 text-center">Belum ada layanan tersedia</p>;
    }

    return (
        <div className="flex flex-col gap-3">
            {services.map((service) => {
                const selected = selectedServices.find((s) => s.serviceId === service.id);

                return (
                    <div
                        key={service.id}
                        className={`bg-surface border rounded-lg p-4 flex items-center gap-4 transition-colors ${selected ? "border-brass" : "border-line"
                            }`}
                    >
                        <button
                            type="button"
                            onClick={() => toggleService(service.id, service.name, service.price)}
                            className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${selected ? "bg-brass border-brass text-ink" : "border-line"
                                }`}
                        >
                            {selected && "✓"}
                        </button>

                        <div className="flex-1">
                            <p className="text-ivory text-sm">{service.name}</p>
                            <p className="text-muted text-xs mt-0.5">
                                {formatDuration(service.duration)} · {formatRupiah(service.price)}
                            </p>
                        </div>

                        {selected && (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => updateQty(service.id, selected.qty - 1)}
                                    className="w-7 h-7 rounded border border-line text-ivory hover:border-brass transition-colors"
                                >
                                    −
                                </button>
                                <span className="font-mono text-ivory w-5 text-center">{selected.qty}</span>
                                <button
                                    type="button"
                                    onClick={() => updateQty(service.id, selected.qty + 1)}
                                    className="w-7 h-7 rounded border border-line text-ivory hover:border-brass transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}