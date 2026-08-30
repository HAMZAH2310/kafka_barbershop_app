"use client";

import { useState, useEffect } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { Order } from "@/lib/orders";
import { serviceStatusLabel, paymentStatusLabel, serviceStatusColor, paymentStatusColor } from "@/lib/orderStatus";
import StatCard from "@/components/ui/StatCard";
import CheckPaymentStatusButton from "@/components/admin/order/CheckPaymentStatusButton";

interface Props {
    orders?: Order[];
}

type FilterTab = "all" | "waiting" | "in_service" | "completed";

const TABS: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "waiting", label: "Menunggu" },
    { key: "in_service", label: "Dilayani" },
    { key: "completed", label: "Selesai" },
];

export default function DashboardMobile({ orders: initialOrders = [] }: Props) {
    const { orders, setOrders } = useOrderStore();
    const [activeTab, setActiveTab] = useState<FilterTab>("all");

    useEffect(() => {
        if (initialOrders && initialOrders.length > 0) {
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
        <div className="p-4 pb-20">
            <h1 className="font-display text-2xl text-ivory mb-4">Order Masuk</h1>

            <div className="grid grid-cols-2 gap-3 mb-5">
                <StatCard label="Menunggu" value={stats.waiting} />
                <StatCard label="Dilayani" value={stats.in_service} accent />
                <StatCard label="Selesai" value={stats.completed} />
                <StatCard label="Belum Bayar" value={stats.unpaid} />
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap border transition-colors ${activeTab === tab.key
                            ? "bg-brass text-ink border-brass"
                            : "border-line text-muted"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                {filteredOrders.length === 0 && (
                    <p className="text-center text-muted text-sm py-10">Tidak ada order untuk ditampilkan</p>
                )}

                {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-surface border border-line rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-ivory font-medium">{order.customer.name}</p>
                                <p className="text-muted text-xs mt-0.5">Barber: {order.barber.name}</p>
                            </div>
                            <span className="font-mono text-brass text-lg leading-none">
                                {order.queueNumber ? `#${order.queueNumber}` : "—"}
                            </span>
                        </div>

                        <p className="text-muted text-xs mt-3">
                            {order.orderItems && order.orderItems.length > 0
                                ? order.orderItems.map((item) => item.service.name).join(", ")
                                : "Belum ada layanan"}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2.5 py-1 rounded-full text-xs border ${serviceStatusColor(order.service_status)}`}>
                                    {serviceStatusLabel[order.service_status]}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span className={`px-2.5 py-1 rounded-full text-xs border ${paymentStatusColor(order.payement_status)}`}>
                                        {paymentStatusLabel[order.payement_status]}
                                    </span>
                                    <CheckPaymentStatusButton order={order} compact />
                                </div>
                            </div>
                        </div>

                        <p className="text-muted text-[11px] mt-3 border-t border-line pt-2">
                            Check-in: {new Date(order.checkin_time).toLocaleString("id-ID", {
                                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                            })}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}