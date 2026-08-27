"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/ui/Button";

export default function RegisterMobile() {
    const { register, isLoading, error, success, clearError } = useAuthStore();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (password !== confirmPassword) {
            useAuthStore.setState({ error: "Konfirmasi password tidak cocok" });
            return;
        }

        await register(username, email, password);
    };

    return (
        <div className="min-h-screen bg-ink flex flex-col justify-center p-6">
            <h2 className="font-display text-xl text-ivory mb-1">Kafka Barbershop</h2>
            <div className="w-10 h-px bg-brass mb-8" />

            <form onSubmit={handleSubmit}>
                <h1 className="font-display text-2xl text-ivory mb-1">Daftar</h1>
                <p className="text-muted text-sm mb-6">Buat akun untuk mulai booking</p>

                {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-md px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-sm text-brass bg-brass/10 border border-brass/30 rounded-md px-3 py-2 mb-4">
                        {success}
                    </p>
                )}

                <label className="block text-xs text-muted uppercase tracking-widest mb-2">Username</label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory mb-4 focus:outline-none focus:border-brass"
                    placeholder="username kamu"
                />

                <label className="block text-xs text-muted uppercase tracking-widest mb-2">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory mb-4 focus:outline-none focus:border-brass"
                    placeholder="email@contoh.com"
                />

                <label className="block text-xs text-muted uppercase tracking-widest mb-2">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory mb-4 focus:outline-none focus:border-brass"
                    placeholder="••••••••"
                />

                <label className="block text-xs text-muted uppercase tracking-widest mb-2">Konfirmasi Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory mb-6 focus:outline-none focus:border-brass"
                    placeholder="••••••••"
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Memproses..." : "Daftar"}
                </Button>
            </form>
        </div>
    );
}