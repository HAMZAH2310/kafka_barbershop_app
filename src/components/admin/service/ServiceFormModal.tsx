"use client";

import { useState, useEffect } from "react";
import { useServiceStore } from "@/store/useServiceStore";
import { Service } from "@/lib/service";
import Button from "@/components/ui/Button";

interface Props {
    service: Service | null;
    onClose: () => void;
}

export default function ServiceFormModal({ service, onClose }: Props) {
    const { createService, updateService, isLoading, error, clearError } = useServiceStore();
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [price, setPrice] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (service) {
            setName(service.name);
            setDuration(String(service.duration));
            setPrice(String(service.price));
        }
    }, [service]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("duration", duration);
        formData.append("price", price);
        if (file) formData.append("image", file);

        const success = service
            ? await updateService(service.id, formData)
            : await createService(formData);

        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-surface border border-line rounded-lg p-6 w-full max-w-sm">
                <h2 className="font-display text-xl text-ivory mb-5">
                    {service ? "Edit Layanan" : "Tambah Layanan"}
                </h2>

                {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-md px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <label className="block text-xs text-muted uppercase tracking-widest mb-2">Nama Layanan</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-ink border border-line rounded-md px-4 py-2.5 text-ivory mb-4 focus:outline-none focus:border-brass"
                        placeholder="Potong Rambut"
                    />

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="block text-xs text-muted uppercase tracking-widest mb-2">Durasi (menit)</label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-ink border border-line rounded-md px-4 py-2.5 text-ivory focus:outline-none focus:border-brass"
                                placeholder="30"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted uppercase tracking-widest mb-2">Harga (Rp)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-ink border border-line rounded-md px-4 py-2.5 text-ivory focus:outline-none focus:border-brass"
                                placeholder="50000"
                            />
                        </div>
                    </div>

                    <label className="block text-xs text-muted uppercase tracking-widest mb-2">Foto (opsional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full text-muted text-sm mb-6 file:bg-ink file:border file:border-line file:text-ivory file:rounded-md file:px-3 file:py-1.5 file:mr-3"
                    />

                    <div className="flex gap-3">
                        <Button variant="outline" type="button" className="flex-1" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}