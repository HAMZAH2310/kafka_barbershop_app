"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation"
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function LoginDekstop() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAuthStore();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        const user = await login(username, password);

        if (user) {
            router.push(user.role === "ADMIN" ? "/dashboard" : "/customer");
            router.refresh();
        }
    }
    return (
        <div className="min-h-screen flex bg-ink">
            <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 border-r border-line">
                <h2 className="font-display text-2xl text-ivory">Kafka</h2>
                <div>
                    <p className="font-display text-4xl text-ivory leading-snug">
                        "Potongan yang rapi<br />adalah kesan pertama<br />yang tidak terucap."
                    </p>
                    <div className="w-12 h-px bg-brass mt-6" />
                </div>
                <p className="text-muted text-sm">© {new Date().getFullYear()} Kafka Barbershop</p>
            </div>

            <div className="flex-1 flex items-center justify-center p-16">
                <form onSubmit={handleSubmit} className="w-full max-w-sm">
                    <h1 className="font-display text-3xl text-ivory mb-1">Masuk</h1>
                    <p className="text-muted text-sm mb-8">Lanjutkan ke akun kamu</p>

                    {error && (
                        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-md px-3 py-2 mb-4">
                            {error}
                        </p>
                    )}

                    <label className="block text-xs text-muted uppercase tracking-widest mb-2">Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory mb-5 focus:outline-none focus:border-brass transition-colors"
                        placeholder="username kamu"
                    />
                    <label className="block text-xs text-muted uppercase tracking-widest mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory mb-5 focus:outline-none focus:border-brass transition-colors"
                        placeholder="password kamu"
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Memproses..." : "Masuk"}
                    </Button>

                    <p className="text-muted text-sm mt-6 text-center">
                        Belum punya akun?{" "}
                        <a href="/register" className="text-brass hover:text-brass-light">Daftar</a>
                    </p>
                </form>
            </div>
        </div>
    )
}