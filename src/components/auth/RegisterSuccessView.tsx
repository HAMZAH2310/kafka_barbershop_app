"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/ui/Button";

interface RegisterSuccessViewProps {
    email: string;
    onReset: () => void;
}

export default function RegisterSuccessView({ email, onReset }: RegisterSuccessViewProps) {
    const { resendVerification, isLoading } = useAuthStore();
    const [countdown, setCountdown] = useState(60);
    const [resendStatus, setResendStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleResend = async () => {
        if (countdown > 0 || isLoading) return;
        setResendStatus(null);

        const ok = await resendVerification(email);
        if (ok) {
            setResendStatus({
                type: "success",
                message: "Email verifikasi baru berhasil dikirim!",
            });
            setCountdown(60);
        } else {
            setResendStatus({
                type: "error",
                message: "Gagal mengirim ulang email. Silakan coba lagi.",
            });
        }
    };

    const getEmailProviderLink = (userEmail: string) => {
        const domain = userEmail.split("@")[1]?.toLowerCase() || "";
        if (domain.includes("gmail")) {
            return { name: "Buka Gmail", url: "https://mail.google.com" };
        }
        if (domain.includes("yahoo")) {
            return { name: "Buka Yahoo Mail", url: "https://mail.yahoo.com" };
        }
        if (domain.includes("outlook") || domain.includes("hotmail")) {
            return { name: "Buka Outlook", url: "https://outlook.live.com" };
        }
        return { name: "Buka Email App", url: `mailto:${userEmail}` };
    };

    const provider = getEmailProviderLink(email);

    return (
        <div className="w-full max-w-sm text-center animate-in fade-in duration-300">
            {/* Icon Envelope */}
            <div className="w-16 h-16 rounded-2xl bg-brass/10 border border-brass/30 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brass/5">
                <svg
                    className="w-8 h-8 text-brass"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.75"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                </svg>
            </div>

            {/* Heading */}
            <h1 className="font-display text-2xl md:text-3xl text-ivory mb-2">
                Cek Email Kamu
            </h1>
            <p className="text-muted text-sm mb-4 leading-relaxed">
                Kami telah mengirim link verifikasi untuk mengaktifkan akunmu ke:
            </p>

            {/* Email Badge Box */}
            <div className="bg-surface border border-line rounded-lg px-4 py-3 mb-5 text-brass font-mono text-sm break-all select-all flex items-center justify-center gap-2">
                <span>{email}</span>
            </div>

            {/* Direct Open Mail Button */}
            <a
                href={provider.url}
                target={provider.url.startsWith("http") ? "_blank" : "_self"}
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-body text-sm font-medium bg-brass text-ink hover:bg-brass-light transition-colors duration-200 mb-4"
            >
                <span>{provider.name}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            </a>

            {/* Alert Message for Resend Status */}
            {resendStatus && (
                <div
                    className={`text-xs rounded-md px-3 py-2.5 mb-4 border transition-all ${
                        resendStatus.type === "success"
                            ? "text-brass bg-brass/10 border-brass/30"
                            : "text-red-400 bg-red-400/10 border-red-400/30"
                    }`}
                >
                    {resendStatus.message}
                </div>
            )}

            {/* Spam Hint */}
            <div className="p-3 bg-surface/50 border border-line/60 rounded-md text-xs text-muted mb-6 text-left space-y-1">
                <p className="flex items-start gap-1.5">
                    <span className="text-brass">💡</span>
                    <span>Tidak menemukan email? Pastikan untuk memeriksa folder <strong>Spam</strong> atau <strong>Promosi</strong>.</span>
                </p>
            </div>

            {/* Resend Section */}
            <div className="pt-2 border-t border-line">
                <p className="text-xs text-muted mb-3">Belum menerima email verifikasi?</p>
                <Button
                    variant="outline"
                    className="w-full text-xs py-2"
                    disabled={countdown > 0 || isLoading}
                    onClick={handleResend}
                >
                    {isLoading
                        ? "Mengirim ulang..."
                        : countdown > 0
                        ? `Kirim Ulang Email (${countdown}s)`
                        : "Kirim Ulang Email Verifikasi"}
                </Button>
            </div>

            {/* Edit / Retype Email */}
            <div className="mt-6 flex flex-col items-center gap-2 text-xs text-muted">
                <p>
                    Salah memasukkan email?{" "}
                    <button
                        type="button"
                        onClick={onReset}
                        className="text-brass hover:text-brass-light underline transition-colors"
                    >
                        Daftar ulang
                    </button>
                </p>
                <p>
                    Sudah verifikasi?{" "}
                    <a href="/login" className="text-brass hover:text-brass-light transition-colors">
                        Masuk ke akun
                    </a>
                </p>
            </div>
        </div>
    );
}
