"use client";

import { useState, useEffect } from "react";
import { useBarberStore } from "@/store/useBarberStore";
import { Barber } from "@/lib/barbers";
import { barberStatusLabel } from "@/lib/barberStatus";
import Button from "@/components/ui/Button";
import BarberFormModal from "./BarberFormModal";
import BarberStatusSelect from "./BarberStatusSelect";

interface Props {
    initialBarbers: Barber[];
}

export default function BarberListDesktop({ initialBarbers }: Props) {
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
        <div className="p-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl text-ivory">Kelola Barber</h1>
                    <p className="text-muted text-sm mt-1">Tambah, ubah, dan pantau status barber</p>
                </div>
                <Button onClick={() => { setEditingBarber(null); setModalOpen(true); }}>
                    + Tambah Barber
                </Button>
            </div>

            <div className="bg-surface border border-line rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-line text-left text-muted text-xs uppercase tracking-widest">
                            <th className="px-5 py-3 font-normal">Foto</th>
                            <th className="px-5 py-3 font-normal">Nama</th>
                            <th className="px-5 py-3 font-normal">No. HP</th>
                            <th className="px-5 py-3 font-normal">Status</th>
                            <th className="px-5 py-3 font-normal text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {barbers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                                    Belum ada barber, tambahkan sekarang
                                </td>
                            </tr>
                        )}
                        {barbers.map((barber) => (
                            <tr key={barber.id} className="border-b border-line last:border-0 hover:bg-ink/40 transition-colors">
                                <td className="px-5 py-3">
                                    <div className="w-10 h-10 rounded-full bg-ink border border-line overflow-hidden">
                                        {barber.picture && (
                                            <img src={barber.picture} alt={barber.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-ivory">{barber.name}</td>
                                <td className="px-5 py-3 text-muted">{barber.phone}</td>
                                <td className="px-5 py-3">
                                    <BarberStatusSelect barberId={barber.id} currentStatus={barber.status} />
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <button onClick={() => handleEdit(barber)} className="text-muted hover:text-brass text-xs mr-4 transition-colors">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(barber.id)} className="text-muted hover:text-red-400 text-xs transition-colors">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <BarberFormModal barber={editingBarber} onClose={() => setModalOpen(false)} />
            )}
        </div>
    );
}