"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";

interface Props {
    username: string;
    email: string;
}

export default function OnboardingForm({ username, email }: Props) {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/customer/me", { phone });
            router.push("/dashboard-customer");
            router.refresh();

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || "Gagal menyimpan profil");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-ink p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <h1 className="font-display text-2xl text-ivory mb-1">Lengkapi Profil</h1>
                <p className="text-muted text-sm mb-6">Sebelum booking, lengkapi dulu profil kamu</p>

                {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-md px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                <label className="block text-xs text-muted uppercase tracking-widest mb-2">Nama</label>
                <input
                    value={username}
                    disabled
                    className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-muted mb-4 cursor-not-allowed"
                />

                <label className="block text-xs text-muted uppercase tracking-widest mb-2">Email</label>
                <input
                    value={email}
                    disabled
                    className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-muted mb-4 cursor-not-allowed"
                />

                <label className="block text-xs text-muted uppercase tracking-widest mb-2">No. HP</label>
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory mb-8 focus:outline-none focus:border-brass"
                    placeholder="08xxxxxxxxxx"
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Menyimpan..." : "Simpan & Lanjutkan"}
                </Button>
            </form>
        </div>
    );
}