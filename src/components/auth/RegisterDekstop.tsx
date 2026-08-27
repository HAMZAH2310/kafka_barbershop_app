"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/ui/Button";

export default function RegisterDesktop() {
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
        <div className="min-h-screen flex bg-ink">
            <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 border-r border-line">
                <h2 className="font-display text-2xl text-ivory">Kafka</h2>
                <div>
                    <p className="font-display text-4xl text-ivory leading-snug">
                        "Setiap detail kecil,<br />membentuk kesan<br />yang besar."
                    </p>
                    <div className="w-12 h-px bg-brass mt-6" />
                </div>
                <p className="text-muted text-sm">© {new Date().getFullYear()} Kafka Barbershop</p>
            </div>

            <div className="flex-1 flex items-center justify-center p-16">
                <form onSubmit={handleSubmit} className="w-full max-w-sm">
                    <h1 className="font-display text-3xl text-ivory mb-1">Daftar</h1>
                    <p className="text-muted text-sm mb-8">Buat akun untuk mulai booking</p>

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
                        className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory mb-5 focus:outline-none focus:border-brass transition-colors"
                        placeholder="username kamu"
                    />

                    <label className="block text-xs text-muted uppercase tracking-widest mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory mb-5 focus:outline-none focus:border-brass transition-colors"
                        placeholder="email@contoh.com"
                    />

                    <label className="block text-xs text-muted uppercase tracking-widest mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory mb-5 focus:outline-none focus:border-brass transition-colors"
                        placeholder="••••••••"
                    />

                    <label className="block text-xs text-muted uppercase tracking-widest mb-2">Konfirmasi Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory mb-8 focus:outline-none focus:border-brass transition-colors"
                        placeholder="••••••••"
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Memproses..." : "Daftar"}
                    </Button>

                    <p className="text-muted text-sm mt-6 text-center">
                        Sudah punya akun?{" "}
                        <a href="/login" className="text-brass hover:text-brass-light">Masuk</a>
                    </p>
                </form>
            </div>
        </div>
    );
}