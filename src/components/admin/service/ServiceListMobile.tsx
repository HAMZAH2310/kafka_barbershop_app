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

export default function ServiceListMobile({ initialServices }: Props) {
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
        <div className="p-4 pb-20">
            <h1 className="font-display text-2xl text-ivory mb-4">Kelola Layanan</h1>

            <Button className="w-full mb-4" onClick={() => { setEditingService(null); setModalOpen(true); }}>
                + Tambah Layanan
            </Button>

            <div className="flex flex-col gap-3">
                {services.length === 0 && (
                    <p className="text-center text-muted text-sm py-10">Belum ada layanan</p>
                )}

                {services.map((service) => (
                    <div key={service.id} className="bg-surface border border-line rounded-lg overflow-hidden flex">
                        <div className="w-24 h-24 bg-ink flex-shrink-0">
                            {service.image && (
                                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                            )}
                        </div>

                        <div className="p-3 flex-1">
                            <h3 className="text-ivory font-medium text-sm">{service.name}</h3>
                            <p className="text-muted text-xs mt-0.5">{formatDuration(service.duration)}</p>
                            <p className="font-mono text-brass text-sm mt-1">{formatRupiah(service.price)}</p>

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