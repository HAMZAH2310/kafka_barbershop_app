"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useRevenueStore } from "@/store/useRevenueStore";
import { getSocket } from "@/lib/socket";

interface Props {
    initialUsername: string;
    initialRevenue: number;
}

function formatRupiah(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function TopbarMobile({ initialUsername, initialRevenue }: Props) {
    const router = useRouter();
    const { logout } = useAuthStore();
    const { revenue, setRevenue } = useRevenueStore();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setRevenue({ totalRevenue: initialRevenue, totalTransactions: 0 });
    }, [initialRevenue, setRevenue]);

    useEffect(() => {
        const socket = getSocket();
        socket.connect();

        socket.on("revenue:updated", (data) => {
            setRevenue(data);
        });

        return () => {
            socket.off("revenue:updated");
            socket.disconnect();
        };
    }, [setRevenue]);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <div className="border-b border-line">
            <div className="flex items-center justify-between px-4 py-3">
                <p className="text-ivory text-sm">
                    Halo, <span className="text-brass">{initialUsername}</span>
                </p>

                <button
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="text-muted text-sm hover:text-brass transition-colors"
                >
                    {menuOpen ? "Tutup" : "Menu"}
                </button>
            </div>

            <div className="px-4 pb-4">
                <p className="text-muted text-xs uppercase tracking-widest">Keuntungan Bulan Ini</p>
                <p className="font-mono text-brass text-2xl leading-tight mt-1 transition-all">
                    {formatRupiah(revenue.totalRevenue)}
                </p>
            </div>

            {menuOpen && (
                <div className="border-t border-line px-4 py-3">
                    <button
                        onClick={handleLogout}
                        className="text-red-400 text-sm"
                    >
                        Keluar
                    </button>
                </div>
            )}
        </div>
    );
}