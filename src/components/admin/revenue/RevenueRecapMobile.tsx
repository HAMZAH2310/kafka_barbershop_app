"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { RevenueFilterPeriod, RevenueRecapData } from "@/types/revenue";
import { getRevenueRecapClient } from "@/lib/revenueRecap.client";
import { getSocket } from "@/lib/socket";

interface Props {
    initialData: RevenueRecapData | null;
}

const PERIOD_TABS: { key: RevenueFilterPeriod; label: string }[] = [
    { key: "today", label: "Hari Ini" },
    { key: "this_week", label: "Minggu Ini" },
    { key: "this_month", label: "Bulan Ini" },
    { key: "this_year", label: "Tahun Ini" },
    { key: "all_time", label: "Semua Waktu" },
];

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
}

function formatDate(iso: string): string {
    try {
        return new Date(iso).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
}

export default function RevenueRecapMobile({ initialData }: Props) {
    const [data, setData] = useState<RevenueRecapData | null>(initialData);
    const [period, setPeriod] = useState<RevenueFilterPeriod>(initialData?.period.type || "this_month");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "error" | "empty">(
        !initialData ? "loading" : initialData.summary.totalTransactions === 0 ? "empty" : "idle"
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();

    const fetchRecap = useCallback(async (p: RevenueFilterPeriod, sDate?: string, eDate?: string) => {
        setStatus("loading");
        setErrorMessage(null);
        try {
            const res = await getRevenueRecapClient(p, sDate, eDate);
            setData(res);
            if (res.summary.totalTransactions === 0) {
                setStatus("empty");
            } else {
                setStatus("idle");
            }
        } catch (err: unknown) {
            setStatus("error");
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage("Gagal memuat rekapitulasi.");
            }
        }
    }, []);

    const handlePeriodChange = (newPeriod: RevenueFilterPeriod) => {
        setPeriod(newPeriod);
        startTransition(() => {
            fetchRecap(newPeriod);
        });
    };

    useEffect(() => {
        const socket = getSocket();
        socket.connect();

        const handleUpdate = () => {
            fetchRecap(period, startDate, endDate);
        };

        socket.on("revenue:updated", handleUpdate);
        socket.on("order:statusUpdated", handleUpdate);

        return () => {
            socket.off("revenue:updated", handleUpdate);
            socket.off("order:statusUpdated", handleUpdate);
        };
    }, [fetchRecap, period, startDate, endDate]);

    const filteredTransactions = (data?.recentTransactions || []).filter((tx) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            tx.invoiceNo.toLowerCase().includes(q) ||
            tx.customerName.toLowerCase().includes(q) ||
            tx.barberName.toLowerCase().includes(q) ||
            tx.paymentMethod.toLowerCase().includes(q)
        );
    });

    return (
        <div className="p-4 pb-24 max-w-lg mx-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="font-display text-2xl text-ivory">Recap Pendapatan</h1>
                    <p className="text-muted text-xs">Omzet & Performa Barbershop</p>
                </div>
                <button
                    onClick={() => fetchRecap(period, startDate, endDate)}
                    disabled={status === "loading" || isPending}
                    className="p-2 bg-surface border border-line rounded-md text-ivory text-xs disabled:opacity-50"
                    aria-label="Refresh data"
                >
                    <svg className={`w-4 h-4 ${status === "loading" || isPending ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            {/* Filter Tabs (Horizontal Scrollable) */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
                {PERIOD_TABS.map((tab) => {
                    const isActive = period === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => handlePeriodChange(tab.key)}
                            className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap font-medium transition-all ${isActive
                                ? "bg-brass text-ink font-semibold"
                                : "bg-surface border border-line text-muted"
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ERROR STATE */}
            {status === "error" && (
                <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-red-200 mb-4 text-xs">
                    <p className="font-semibold">Gagal memuat data</p>
                    <p className="text-muted mt-1">{errorMessage}</p>
                    <button
                        onClick={() => fetchRecap(period, startDate, endDate)}
                        className="mt-2 px-3 py-1 bg-red-900 text-ivory rounded text-xs"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {/* LOADING SKELETON */}
            {status === "loading" && (
                <div className="space-y-4 animate-pulse">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-24 bg-surface border border-line rounded-lg" />
                        <div className="h-24 bg-surface border border-line rounded-lg" />
                        <div className="h-24 bg-surface border border-line rounded-lg" />
                        <div className="h-24 bg-surface border border-line rounded-lg" />
                    </div>
                    <div className="h-40 bg-surface border border-line rounded-lg" />
                    <div className="h-48 bg-surface border border-line rounded-lg" />
                </div>
            )}

            {/* CONTENT */}
            {status !== "loading" && data && (
                <>
                    {/* KPI CARDS (2x2 Grid) */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-surface border border-brass/40 rounded-lg p-3.5">
                            <p className="text-muted text-[10px] uppercase tracking-wider">Total Omzet</p>
                            <p className="font-mono text-xl font-semibold mt-1 text-brass">
                                {formatRupiah(data.summary.totalRevenue)}
                            </p>
                        </div>

                        <div className="bg-surface border border-line rounded-lg p-3.5">
                            <p className="text-muted text-[10px] uppercase tracking-wider">Transaksi Lunas</p>
                            <p className="font-mono text-xl font-semibold mt-1 text-ivory">
                                {data.summary.totalTransactions}
                            </p>
                        </div>

                        <div className="bg-surface border border-line rounded-lg p-3.5">
                            <p className="text-muted text-[10px] uppercase tracking-wider">AOV / Belanja</p>
                            <p className="font-mono text-base font-semibold mt-1 text-ivory">
                                {formatRupiah(data.summary.averageOrderValue)}
                            </p>
                        </div>

                        <div className="bg-surface border border-line rounded-lg p-3.5">
                            <p className="text-muted text-[10px] uppercase tracking-wider">Layanan Terjual</p>
                            <p className="font-mono text-xl font-semibold mt-1 text-ivory">
                                {data.summary.totalServices} item
                            </p>
                        </div>
                    </div>

                    {status === "empty" && (
                        <div className="bg-surface border border-line rounded-lg p-8 text-center my-4">
                            <p className="text-ivory font-display text-base">Belum Ada Transaksi</p>
                            <p className="text-muted text-xs mt-1">Tidak ada transaksi lunas di periode ini.</p>
                        </div>
                    )}

                    {status !== "empty" && (
                        <>
                            {/* PAYMENT METHOD BREAKDOWN */}
                            <div className="bg-surface border border-line rounded-lg p-4 mb-4">
                                <h2 className="text-ivory font-medium text-sm mb-3">Metode Pembayaran</h2>
                                <div className="space-y-3">
                                    {data.byPaymentMethod.map((pm) => (
                                        <div key={pm.method} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-ivory">{pm.label}</span>
                                                <span className="text-brass font-mono">{formatRupiah(pm.revenue)}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-ink rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-brass rounded-full"
                                                    style={{ width: `${pm.percentage}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[10px] text-muted">
                                                <span>{pm.count} transaksi</span>
                                                <span>{pm.percentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BARBER PERFORMANCE */}
                            <div className="bg-surface border border-line rounded-lg p-4 mb-4">
                                <h2 className="text-ivory font-medium text-sm mb-3">Performa Barber</h2>
                                <div className="space-y-2.5">
                                    {data.byBarber.map((b) => (
                                        <div key={b.barberId} className="flex items-center justify-between py-2 border-b border-line/40 last:border-0 text-xs">
                                            <div>
                                                <p className="text-ivory font-medium">{b.barberName}</p>
                                                <p className="text-[10px] text-muted">{b.orderCount} order selesai</p>
                                            </div>
                                            <p className="text-brass font-mono font-medium">{formatRupiah(b.revenue)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* TRANSACTION DETAILS LIST */}
                            <div className="bg-surface border border-line rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-ivory font-medium text-sm">Riwayat Transaksi</h2>
                                    <span className="text-[10px] text-muted">{filteredTransactions.length} data</span>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Cari transaksi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-ink border border-line text-ivory text-xs rounded-md px-3 py-2 mb-3 focus:outline-none focus:border-brass"
                                />

                                <div className="space-y-3">
                                    {filteredTransactions.map((tx) => (
                                        <div key={tx.invoiceId} className="bg-ink/50 border border-line/60 rounded-lg p-3 space-y-1.5 text-xs">
                                            <div className="flex justify-between items-center">
                                                <span className="font-mono text-brass font-medium">{tx.invoiceNo}</span>
                                                <span className="text-brass font-mono font-semibold">{formatRupiah(tx.totalAmount)}</span>
                                            </div>
                                            <div className="flex justify-between text-muted text-[11px]">
                                                <span className="text-ivory">{tx.customerName}</span>
                                                <span>Kapster: {tx.barberName}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-muted pt-1 border-t border-line/40">
                                                <span>{tx.paymentMethod}</span>
                                                <span>{formatDate(tx.paidAt)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
