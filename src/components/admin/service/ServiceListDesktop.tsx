"use client";

import { useState } from "react";
import { useServiceStore } from "@/store/useServiceStore";
import { Service } from "@/lib/service";
import { formatRupiah, formatDuration } from "@/lib/format";
import Button from "@/components/ui/Button";
import ServiceFormModal from "./ServiceFormModal";

interface Props {
    initialServices: Service[];
}

export default function ServiceListDesktop({ initialServices }: Props) {
    const { services, setServices, deleteService } = useServiceStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    useState(() => {
        setServices(initialServices);
    });

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Yakin ingin menghapus layanan ini?")) {
            await deleteService(id);
        }
    };

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl text-ivory">Kelola Layanan</h1>
                    <p className="text-muted text-sm mt-1">Atur daftar layanan, harga, dan durasi</p>
                </div>
                <Button onClick={() => { setEditingService(null); setModalOpen(true); }}>
                    + Tambah Layanan
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {services.length === 0 && (
                    <p className="col-span-3 text-center text-muted py-10">
                        Belum ada layanan, tambahkan sekarang
                    </p>
                )}

                {services.map((service) => (
                    <div key={service.id} className="bg-surface border border-line rounded-lg overflow-hidden">
                        <div className="h-36 bg-ink border-b border-line">
                            {service.image && (
                                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="text-ivory font-medium">{service.name}</h3>
                            <p className="text-muted text-xs mt-1">{formatDuration(service.duration)}</p>
                            <p className="font-mono text-brass mt-2">{formatRupiah(service.price)}</p>

                            <div className="flex gap-4 mt-4 pt-3 border-t border-line">
                                <button onClick={() => handleEdit(service)} className="text-muted hover:text-brass text-xs transition-colors">
                                    Edit
                                </button>
                                {service.isActive && (
                                    <button onClick={() => handleDelete(service.id)} className="text-muted hover:text-red-400 text-xs transition-colors">
                                        Nonaktifkan
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <ServiceFormModal service={editingService} onClose={() => setModalOpen(false)} />
            )}
        </div>
    );
}