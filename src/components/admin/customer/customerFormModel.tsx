"use client";

import { useState, useEffect } from "react";
import { useCustomerStore } from "@/store/useCustomerStore";
import { Customer } from "@/lib/customer";
import Button from "@/components/ui/Button";

interface Props {
    customer: Customer | null;
    onClose: () => void;
}

export default function CustomerFormModal({ customer, onClose }: Props) {
    const { createCustomer, updateCustomer, isLoading, error, clearError } = useCustomerStore();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (customer) {
            setName(customer.name);
            setEmail(customer.email);
            setPhone(String(customer.phone));
        }
    }, [customer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        if (file) formData.append("profilePicture", file);

        const success = customer
            ? await updateCustomer(customer.id, formData)
            : await createCustomer(formData);

        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-surface border border-line rounded-lg p-6 w-full max-w-sm">
                <h2 className="font-display text-xl text-ivory mb-5">
                    {customer ? "Edit Customer" : "Tambah Customer"}
                </h2>

                {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-md px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <label className="block text-xs text-muted uppercase tracking-widest mb-2">Nama</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-ink border border-line rounded-md px-4 py-2.5 text-ivory mb-4 focus:outline-none focus:border-brass"
                        placeholder="Nama customer"
                    />

                    <label className="block text-xs text-muted uppercase tracking-widest mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-ink border border-line rounded-md px-4 py-2.5 text-ivory mb-4 focus:outline-none focus:border-brass"
                        placeholder="email@contoh.com"
                    />

                    <label className="block text-xs text-muted uppercase tracking-widest mb-2">No. HP</label>
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-ink border border-line rounded-md px-4 py-2.5 text-ivory mb-4 focus:outline-none focus:border-brass"
                        placeholder="08xxxxxxxxxx"
                    />

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