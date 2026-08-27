"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/ui/Button";

export default function VerifyEmailStatus() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const { verifyEmail, verifyStatus, verifyMessage } = useAuthStore();

    useEffect(() => {
        if (!token) {
            useAuthStore.setState({ verifyStatus: "error", verifyMessage: "Link verifikasi tidak valid" });
            return;
        }
        verifyEmail(token);
    }, [token, verifyEmail]);

    return (
        <div className="w-full max-w-sm text-center">
            {verifyStatus === "loading" && (
                <>
                    <div className="w-10 h-10 border-2 border-line border-t-brass rounded-full animate-spin mx-auto mb-6" />
                    <h1 className="font-display text-2xl text-ivory">Memverifikasi email...</h1>
                    <p className="text-muted text-sm mt-2">Mohon tunggu sebentar</p>
                </>
            )}

            {verifyStatus === "success" && (
                <>
                    <div className="w-14 h-14 rounded-full bg-brass/10 border border-brass flex items-center justify-center mx-auto mb-6">
                        <span className="text-brass text-2xl">✓</span>
                    </div>
                    <h1 className="font-display text-2xl text-ivory">Email Terverifikasi</h1>
                    <p className="text-muted text-sm mt-2 mb-8">{verifyMessage}</p>
                    <Button className="w-full" onClick={() => router.push("/login")}>
                        Masuk Sekarang
                    </Button>
                </>
            )}

            {verifyStatus === "expired" && (
                <>
                    <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center mx-auto mb-6">
                        <span className="text-red-400 text-2xl">!</span>
                    </div>
                    <h1 className="font-display text-2xl text-ivory">Link Sudah Kadaluarsa</h1>
                    <p className="text-muted text-sm mt-2 mb-8">
                        Link verifikasi berlaku 1 jam. Minta link baru untuk lanjut verifikasi.
                    </p>
                    <Button className="w-full" onClick={() => router.push("/resend-verification")}>
                        Kirim Ulang Email Verifikasi
                    </Button>
                </>
            )}

            {verifyStatus === "error" && (
                <>
                    <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center mx-auto mb-6">
                        <span className="text-red-400 text-2xl">✕</span>
                    </div>
                    <h1 className="font-display text-2xl text-ivory">Verifikasi Gagal</h1>
                    <p className="text-muted text-sm mt-2 mb-8">{verifyMessage}</p>
                    <Button variant="outline" className="w-full" onClick={() => router.push("/login")}>
                        Kembali ke Login
                    </Button>
                </>
            )}
        </div>
    );
}