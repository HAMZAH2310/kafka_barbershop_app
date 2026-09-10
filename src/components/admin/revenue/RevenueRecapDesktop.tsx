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
    { key: "all_time", label: "Semua (Sepanjang Waktu)" },
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
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
}

function formatDayLabel(dateStr: string): string {
    try {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}`;
        }
        return dateStr;
    } catch {
        return dateStr;
    }
}

export default function RevenueRecapDesktop({ initialData }: Props) {
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
                setErrorMessage("Gagal memuat rekapitulasi pendapatan.");
            }
        }
    }, []);

    const handlePeriodChange = (newPeriod: RevenueFilterPeriod) => {
        setPeriod(newPeriod);
        startTransition(() => {
            fetchRecap(newPeriod);
        });
    };

    // Socket realtime listener
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
            tx.paymentMethod.toLowerCase().includes(q) ||
            tx.serviceNames.some((s) => s.toLowerCase().includes(q))
        );
    });

    const maxTrendRevenue = data?.dailyTrend.length
        ? Math.max(...data.dailyTrend.map((d) => d.revenue), 1)
        : 1;

    return (
        <div className="p-10 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-3xl text-ivory">Recap Pendapatan</h1>
                    <p className="text-muted text-sm mt-1">
                        Laporan keuangan omzet, performa barber, dan rincian transaksi terbayar
                    </p>
                </div>

                <button
                    onClick={() => fetchRecap(period, startDate, endDate)}
                    disabled={status === "loading" || isPending}
                    className="self-start md:self-auto px-4 py-2 bg-surface hover:bg-ink border border-line text-ivory text-xs rounded-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    <svg className={`w-3.5 h-3.5 ${status === "loading" || isPending ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Segarkan Data
                </button>
            </div>

            {/* Filter Tabs & Date Range */}
            <div className="bg-surface border border-line rounded-lg p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                    {PERIOD_TABS.map((tab) => {
                        const isActive = period === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => handlePeriodChange(tab.key)}
                                className={`px-4 py-2 text-xs rounded-md transition-all font-medium ${isActive
                                    ? "bg-brass text-ink font-semibold shadow-sm"
                                    : "text-muted hover:text-ivory hover:bg-ink/60"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ERROR STATE */}
            {status === "error" && (
                <div className="p-6 bg-red-950/30 border border-red-900/50 rounded-lg text-red-200 mb-8 flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-sm">Gagal Mengambil Data</p>
                        <p className="text-xs text-red-300/80 mt-1">{errorMessage || "Terjadi kesalahan pada server."}</p>
                    </div>
                    <button
                        onClick={() => fetchRecap(period, startDate, endDate)}
                        className="px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-xs rounded-md transition-colors"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {/* LOADING SKELETON */}
            {status === "loading" && (
                <div className="space-y-8 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-28 bg-surface/50 border border-line rounded-lg p-5">
                                <div className="h-3 w-20 bg-line rounded mb-4" />
                                <div className="h-8 w-32 bg-line rounded" />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 h-72 bg-surface/50 border border-line rounded-lg" />
                        <div className="h-72 bg-surface/50 border border-line rounded-lg" />
                    </div>
                    <div className="h-64 bg-surface/50 border border-line rounded-lg" />
                </div>
            )}

            {/* MAIN CONTENT (IDLE & EMPTY) */}
            {status !== "loading" && data && (
                <>
                    {/* KPI CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-surface border border-brass/30 rounded-lg p-5 relative overflow-hidden group hover:border-brass transition-colors">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brass/5 rounded-full blur-xl pointer-events-none" />
                            <p className="text-muted text-xs uppercase tracking-widest">Total Omzet</p>
                            <p className="font-mono text-3xl font-semibold mt-2 text-brass">
                                {formatRupiah(data.summary.totalRevenue)}
                            </p>
                            <p className="text-xs text-muted/80 mt-1">Pendapatan bersih terbayar</p>
                        </div>

                        <div className="bg-surface border border-line rounded-lg p-5">
                            <p className="text-muted text-xs uppercase tracking-widest">Transaksi Lunas</p>
                            <p className="font-mono text-3xl font-semibold mt-2 text-ivory">
                                {data.summary.totalTransactions}
                            </p>
                            <p className="text-xs text-muted/80 mt-1">Pesanan selesai & invoice lunas</p>
                        </div>

                        <div className="bg-surface border border-line rounded-lg p-5">
                            <p className="text-muted text-xs uppercase tracking-widest">Rata-Rata Order (AOV)</p>
                            <p className="font-mono text-3xl font-semibold mt-2 text-ivory">
                                {formatRupiah(data.summary.averageOrderValue)}
                            </p>
                            <p className="text-xs text-muted/80 mt-1">Nilai belanja per transaksi</p>
                        </div>

                        <div className="bg-surface border border-line rounded-lg p-5">
                            <p className="text-muted text-xs uppercase tracking-widest">Layanan Terjual</p>
                            <p className="font-mono text-3xl font-semibold mt-2 text-ivory">
                                {data.summary.totalServices}
                            </p>
                            <p className="text-xs text-muted/80 mt-1">Total pengerjaan item potong & treatment</p>
                        </div>
                    </div>

                    {/* EMPTY STATE BANNER */}
                    {status === "empty" && (
                        <div className="bg-surface border border-line rounded-lg p-10 text-center mb-8">
                            <p className="text-ivory font-display text-lg">Belum Ada Transaksi</p>
                            <p className="text-muted text-xs mt-1">
                                Belum ada order berstatus lunas pada periode ini. Silakan pilih rentang tanggal lain.
                            </p>
                        </div>
                    )}

                    {status !== "empty" && (
                        <>
                            {/* CHARTS & PAYMENT BREAKDOWN */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                {/* DAILY TREND BAR CHART */}
                                <div className="lg:col-span-2 bg-surface border border-line rounded-lg p-6 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-ivory font-medium text-base">Tren Omzet Harian</h2>
                                            <p className="text-xs text-muted mt-0.5">Grafik pendapatan per tanggal</p>
                                        </div>
                                    </div>

                                    {data.dailyTrend.length === 0 ? (
                                        <div className="h-48 flex items-center justify-center text-muted text-xs">
                                            Tidak ada data tren harian
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="h-48 flex items-end gap-2 pt-6 overflow-x-auto pb-2">
                                                {data.dailyTrend.map((d) => {
                                                    const heightPercent = Math.max(Math.round((d.revenue / maxTrendRevenue) * 100), 8);
                                                    return (
                                                        <div
                                                            key={d.date}
                                                            className="flex-1 min-w-[2.25rem] flex flex-col items-center gap-2 group relative"
                                                        >
                                                            {/* Tooltip on hover */}
                                                            <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                                                                <div className="bg-ink border border-line px-2.5 py-1.5 rounded text-[11px] shadow-lg whitespace-nowrap text-center">
                                                                    <p className="text-brass font-mono font-medium">{formatRupiah(d.revenue)}</p>
                                                                    <p className="text-muted text-[10px]">{d.transactions} transaksi ({d.date})</p>
                                                                </div>
                                                                <div className="w-1.5 h-1.5 bg-ink border-r border-b border-line rotate-45 -mt-1" />
                                                            </div>

                                                            <div
                                                                style={{ height: `${heightPercent}%` }}
                                                                className="w-full max-w-[28px] bg-gradient-to-t from-brass/30 to-brass rounded-t-sm group-hover:brightness-125 transition-all"
                                                            />
                                                            <span className="text-[10px] font-mono text-muted/70 group-hover:text-ivory">
                                                                {formatDayLabel(d.date)}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* PAYMENT METHODS */}
                                <div className="bg-surface border border-line rounded-lg p-6 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-ivory font-medium text-base">Metode Pembayaran</h2>
                                        <p className="text-xs text-muted mt-0.5">Komposisi kanal penerimaan uang</p>
                                    </div>

                                    <div className="space-y-4 my-4">
                                        {data.byPaymentMethod.length === 0 && (
                                            <p className="text-muted text-xs text-center py-6">Belum ada data pembayaran</p>
                                        )}
                                        {data.byPaymentMethod.map((pm) => (
                                            <div key={pm.method} className="space-y-1.5">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-ivory font-medium">{pm.label}</span>
                                                    <span className="text-muted font-mono">{formatRupiah(pm.revenue)} ({pm.percentage}%)</span>
                                                </div>
                                                <div className="w-full h-2 bg-ink rounded-full overflow-hidden border border-line/60">
                                                    <div
                                                        className="h-full bg-brass rounded-full transition-all duration-500"
                                                        style={{ width: `${pm.percentage}%` }}
                                                    />
                                                </div>
                                                <div className="text-[11px] text-muted text-right">
                                                    {pm.count} transaksi
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-[11px] text-muted border-t border-line/60 pt-3">
                                        Total kanal aktif: <span className="text-ivory font-semibold">{data.byPaymentMethod.length} metode</span>
                                    </div>
                                </div>
                            </div>

                            {/* BARBER PERFORMANCE & TOP SERVICES */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* BARBER BREAKDOWN */}
                                <div className="bg-surface border border-line rounded-lg p-6">
                                    <h2 className="text-ivory font-medium text-base mb-1">Performa Kapster / Barber</h2>
                                    <p className="text-xs text-muted mb-4">Total kontribusi omzet dan order yang ditangani</p>

                                    {data.byBarber.length === 0 ? (
                                        <p className="text-muted text-xs text-center py-6">Belum ada data barber</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="border-b border-line text-muted uppercase tracking-wider text-[10px]">
                                                        <th className="py-2.5 px-3">Nama Barber</th>
                                                        <th className="py-2.5 px-3 text-center">Order</th>
                                                        <th className="py-2.5 px-3 text-right">Total Omzet</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.byBarber.map((b) => (
                                                        <tr key={b.barberId} className="border-b border-line/50 last:border-0 hover:bg-ink/30 transition-colors">
                                                            <td className="py-3 px-3 font-medium text-ivory flex items-center gap-2">
                                                                <span className="w-6 h-6 rounded-full bg-brass/10 border border-brass/30 flex items-center justify-center text-brass font-mono text-[10px]">
                                                                    {b.barberName.charAt(0).toUpperCase()}
                                                                </span>
                                                                {b.barberName}
                                                            </td>
                                                            <td className="py-3 px-3 text-center text-ivory/80 font-mono">{b.orderCount}</td>
                                                            <td className="py-3 px-3 text-right text-brass font-mono font-medium">{formatRupiah(b.revenue)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* TOP SERVICES */}
                                <div className="bg-surface border border-line rounded-lg p-6">
                                    <h2 className="text-ivory font-medium text-base mb-1">Layanan Terpopuler</h2>
                                    <p className="text-xs text-muted mb-4">Produktivitas dan omzet per jenis jasa</p>

                                    {data.byService.length === 0 ? (
                                        <p className="text-muted text-xs text-center py-6">Belum ada data layanan</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="border-b border-line text-muted uppercase tracking-wider text-[10px]">
                                                        <th className="py-2.5 px-3">Nama Layanan</th>
                                                        <th className="py-2.5 px-3 text-center">Qty Terjual</th>
                                                        <th className="py-2.5 px-3 text-right">Total Omzet</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.byService.map((s) => (
                                                        <tr key={s.serviceId} className="border-b border-line/50 last:border-0 hover:bg-ink/30 transition-colors">
                                                            <td className="py-3 px-3 font-medium text-ivory">{s.serviceName}</td>
                                                            <td className="py-3 px-3 text-center text-ivory/80 font-mono">{s.quantity}x</td>
                                                            <td className="py-3 px-3 text-right text-brass font-mono font-medium">{formatRupiah(s.revenue)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DETAILED TRANSACTIONS TABLE */}
                            <div className="bg-surface border border-line rounded-lg overflow-hidden">
                                <div className="p-5 border-b border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-ivory font-medium text-base">Rincian Transaksi Terbayar</h2>
                                        <p className="text-xs text-muted mt-0.5">
                                            Daftar invoice pesanan yang telah berhasil diverifikasi
                                        </p>
                                    </div>

                                    <div className="relative w-full md:w-64">
                                        <input
                                            type="text"
                                            placeholder="Cari invoice, customer, barber..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-ink border border-line text-ivory text-xs rounded-md pl-8 pr-3 py-2 focus:outline-none focus:border-brass placeholder:text-muted/60"
                                        />
                                        <svg className="w-3.5 h-3.5 text-muted absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead>
                                            <tr className="border-b border-line text-muted uppercase tracking-wider text-[10px] bg-ink/30">
                                                <th className="py-3 px-5">No. Invoice</th>
                                                <th className="py-3 px-5">Customer</th>
                                                <th className="py-3 px-5">Barber</th>
                                                <th className="py-3 px-5">Layanan</th>
                                                <th className="py-3 px-5">Metode Bayar</th>
                                                <th className="py-3 px-5">Waktu Lunas</th>
                                                <th className="py-3 px-5 text-right">Total Bayar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTransactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="py-10 text-center text-muted">
                                                        {searchQuery ? "Tidak ada transaksi yang cocok dengan pencarian." : "Belum ada transaksi terbayar."}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredTransactions.map((tx) => (
                                                    <tr key={tx.invoiceId} className="border-b border-line/40 last:border-0 hover:bg-ink/40 transition-colors">
                                                        <td className="py-3.5 px-5 font-mono text-brass font-medium">
                                                            {tx.invoiceNo}
                                                        </td>
                                                        <td className="py-3.5 px-5 text-ivory font-medium">{tx.customerName}</td>
                                                        <td className="py-3.5 px-5 text-ivory/80">{tx.barberName}</td>
                                                        <td className="py-3.5 px-5 text-muted">
                                                            {tx.serviceNames.join(", ")}
                                                        </td>
                                                        <td className="py-3.5 px-5">
                                                            <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-ink border border-line text-ivory/90">
                                                                {tx.paymentMethod}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-5 text-muted text-[11px]">
                                                            {formatDate(tx.paidAt)}
                                                        </td>
                                                        <td className="py-3.5 px-5 text-right font-mono text-brass font-semibold">
                                                            {formatRupiah(tx.totalAmount)}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
