"use client";

import { useEffect } from "react";
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

export default function Topbar({ initialUsername, initialRevenue }: Props) {
    const router = useRouter();
    const { logout } = useAuthStore();
    const { revenue, setRevenue } = useRevenueStore();

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
        <div className="flex items-center justify-between px-8 py-4 border-b border-line">
            <p className="text-ivory">
                Halo, <span className="text-brass">{initialUsername}</span>
            </p>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-muted text-xs uppercase tracking-widest">Keuntungan Bulan Ini</p>
                    <p className="font-mono text-brass text-lg leading-tight transition-all">
                        {formatRupiah(revenue.totalRevenue)}
                    </p>
                </div>

                <div className="w-px h-8 bg-line" />

                <button onClick={handleLogout} className="text-muted text-sm hover:text-brass transition-colors">
                    Keluar
                </button>
            </div>
        </div>
    );
}