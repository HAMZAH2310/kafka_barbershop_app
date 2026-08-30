"use client";

import { useState, useEffect } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { Order } from "@/lib/orders";
import { serviceStatusLabel, paymentStatusLabel, serviceStatusColor, paymentStatusColor } from "@/lib/orderStatus";
import OrderActionButton from "./OrderActionButton";
import CheckPaymentStatusButton from "./CheckPaymentStatusButton";

interface Props {
    initialOrders: Order[];
}

type FilterTab = "all" | "waiting" | "in_service" | "completed";

const TABS: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "waiting", label: "Menunggu" },
    { key: "in_service", label: "Dilayani" },
    { key: "completed", label: "Selesai" },
];

export default function OrderListMobile({ initialOrders }: Props) {
    const { orders, setOrders } = useOrderStore();
    const [activeTab, setActiveTab] = useState<FilterTab>("all");

    useEffect(() => {
        if (initialOrders) {
            setOrders(initialOrders);
        }
    }, [initialOrders, setOrders]);

    const filteredOrders = activeTab === "all"
        ? orders
        : orders.filter((o) => o.service_status === activeTab);

    return (
        <div className="p-4 pb-20">
            <h1 className="font-display text-2xl text-ivory mb-4">Kelola Order</h1>

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

                        <div className="flex items-center gap-2 flex-wrap mt-3">
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

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
                            <p className="text-muted text-[11px]">
                                {new Date(order.checkin_time).toLocaleString("id-ID", {
                                    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                                })}
                            </p>
                            <OrderActionButton orderId={order.id} currentStatus={order.service_status} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}