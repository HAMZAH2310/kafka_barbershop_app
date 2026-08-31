"use client";

import { useState, useEffect } from "react";
import { useBarberStore } from "@/store/useBarberStore";
import { Barber } from "@/lib/barbers";
import Button from "@/components/ui/Button";
import BarberFormModal from "./BarberFormModal";
import BarberStatusSelect from "./BarberStatusSelect";

interface Props {
    initialBarbers: Barber[];
}

export default function BarberListMobile({ initialBarbers }: Props) {
    const { barbers, setBarbers, deleteBarber } = useBarberStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

    useEffect(() => {
        setBarbers(initialBarbers);
    }, []);

    const handleEdit = (barber: Barber) => {
        setEditingBarber(barber);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Yakin ingin menghapus barber ini?")) {
            await deleteBarber(id);
        }
    };

    return (
        <div className="p-4 pb-20">
            <div className="flex items-center justify-between mb-4">
                <h1 className="font-display text-2xl text-ivory">Kelola Barber</h1>
            </div>

            <Button className="w-full mb-4" onClick={() => { setEditingBarber(null); setModalOpen(true); }}>
                + Tambah Barber
            </Button>

            <div className="flex flex-col gap-3">
                {barbers.length === 0 && (
                    <p className="text-center text-muted text-sm py-10">Belum ada barber</p>
                )}

                {barbers.map((barber) => (
                    <div key={barber.id} className="bg-surface border border-line rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-ink border border-line overflow-hidden flex-shrink-0">
                                {barber.picture && (
                                    <img src={barber.picture} alt={barber.name} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-ivory font-medium">{barber.name}</p>
                                <p className="text-muted text-xs">{barber.phone}</p>
                            </div>
                            <BarberStatusSelect barberId={barber.id} currentStatus={barber.status} />
                        </div>

                        <div className="flex gap-4 mt-3 pt-3 border-t border-line">
                            <button onClick={() => handleEdit(barber)} className="text-muted hover:text-brass text-xs transition-colors">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(barber.id)} className="text-muted hover:text-red-400 text-xs transition-colors">
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <BarberFormModal barber={editingBarber} onClose={() => setModalOpen(false)} />
            )}
        </div>
    );
}