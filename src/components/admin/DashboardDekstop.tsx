"use client";

import { useState, useEffect } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { Order } from "@/lib/orders";
import { serviceStatusColor, paymentStatusColor, serviceStatusLabel, paymentStatusLabel } from "@/lib/orderStatus";
import StatCard from "@/components/ui/StatCard";
import CheckPaymentStatusButton from "@/components/admin/order/CheckPaymentStatusButton";

interface Props {
    orders: Order[];
}

type FilterTab = "all" | "waiting" | "in_service" | "completed";

const TABS: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "waiting", label: "Menunggu" },
    { key: "in_service", label: "Sedang Dilayani" },
    { key: "completed", label: "Selesai" },
];

export default function DashboardDesktop({ orders: initialOrders }: Props) {
    const { orders, setOrders } = useOrderStore();
    const [activeTab, setActiveTab] = useState<FilterTab>("all");

    useEffect(() => {
        if (initialOrders) {
            setOrders(initialOrders);
        }
    }, [initialOrders, setOrders]);

    const displayOrders = orders.length > 0 ? orders : initialOrders;

    const filteredOrders = activeTab === "all"
        ? displayOrders
        : displayOrders.filter((o) => o.service_status === activeTab);

    const stats = {
        waiting: displayOrders.filter((o) => o.service_status === "waiting").length,
        in_service: displayOrders.filter((o) => o.service_status === "in_service").length,
        completed: displayOrders.filter((o) => o.service_status === "completed").length,
        unpaid: displayOrders.filter((o) => o.payement_status === "unpaid" || o.payement_status === "pending").length,
    };

    return (
        <div className="p-10">
            <div className="mb-8">
                <h1 className="font-display text-3xl text-ivory">Order Masuk</h1>
                <p className="text-muted text-sm mt-1">Pantau dan kelola seluruh order pelanggan</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard label="Menunggu" value={stats.waiting} />
                <StatCard label="Sedang Dilayani" value={stats.in_service} accent />
                <StatCard label="Selesai Hari Ini" value={stats.completed} />
                <StatCard label="Belum Bayar" value={stats.unpaid} />
            </div>

            <div className="flex gap-2 mb-6 border-b border-line">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px ${activeTab === tab.key
                            ? "border-brass text-brass"
                            : "border-transparent text-muted hover:text-ivory"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-surface border border-line rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-line text-left text-muted text-xs uppercase tracking-widest">
                            <th className="px-5 py-3 font-normal">Antrian</th>
                            <th className="px-5 py-3 font-normal">Customer</th>
                            <th className="px-5 py-3 font-normal">Barber</th>
                            <th className="px-5 py-3 font-normal">Layanan</th>
                            <th className="px-5 py-3 font-normal">Status</th>
                            <th className="px-5 py-3 font-normal">Bayar</th>
                            <th className="px-5 py-3 font-normal">Check-in</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-5 py-10 text-center text-muted">
                                    Tidak ada order untuk ditampilkan
                                </td>
                            </tr>
                        )}
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="border-b border-line last:border-0 hover:bg-ink/40 transition-colors">
                                <td className="px-5 py-4">
                                    <span className="font-mono text-brass">
                                        {order.queueNumber ? `#${order.queueNumber}` : "—"}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-ivory">{order.customer.name}</td>
                                <td className="px-5 py-4 text-ivory/80">{order.barber.name}</td>
                                <td className="px-5 py-4 text-muted">
                                    {order.orderItems && order.orderItems.length > 0
                                        ? order.orderItems.map((item) => item.service.name).join(", ")
                                        : "—"}
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs border ${serviceStatusColor(order.service_status)}`}>
                                        {serviceStatusLabel[order.service_status]}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs border ${paymentStatusColor(order.payement_status)}`}>
                                            {paymentStatusLabel[order.payement_status]}
                                        </span>
                                        <CheckPaymentStatusButton order={order} />
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-muted text-xs">
                                    {new Date(order.checkin_time).toLocaleString("id-ID", {
                                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}