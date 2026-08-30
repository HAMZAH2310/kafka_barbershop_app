"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useOrderStore } from "@/store/useOrderStore";
import { Order } from "@/lib/orders";
import { groupOrders } from "@/lib/orderGroups";
import { paymentStatusLabel, paymentStatusColor } from "@/lib/orderStatus";
import QueueStatusCard from "./QueueStatusCard";
import Button from "@/components/ui/Button";
import PayButton from "./PayButton";

interface Props {
    username: string;
    initialOrders: Order[];
}

export default function DashboardDesktop({ username, initialOrders }: Props) {
    const { orders, setOrders, fetchQueuePosition } = useOrderStore();

    useState(() => {
        setOrders(initialOrders);
    });

    const { active, needsPayment, history } = groupOrders(orders);

    useEffect(() => {
        if (active && active.service_status === "waiting") {
            fetchQueuePosition(active.id);
        }
    }, [orders, active, fetchQueuePosition]);

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="font-display text-3xl text-ivory">Halo, {username}</h1>
            <p className="text-muted text-sm mt-1">Selamat datang kembali di Kafka Barbershop</p>

            <div className="mt-8">
                {active ? (
                    <QueueStatusCard order={active} />
                ) : (
                    <div className="bg-surface border border-line rounded-lg p-8 text-center">
                        <p className="text-ivory">Belum ada booking aktif</p>
                        <p className="text-muted text-sm mt-1 mb-5">Yuk pesan layanan sekarang</p>
                        <Link href="/booking">
                            <Button>Booking Sekarang</Button>
                        </Link>
                    </div>
                )}
            </div>

            {needsPayment.length > 0 && (
                <div className="mt-10">
                    <h2 className="font-display text-xl text-ivory mb-1">Menunggu Pembayaran</h2>
                    <p className="text-muted text-sm mb-4">Layanan sudah selesai, segera selesaikan pembayaran</p>

                    <div className="flex flex-col gap-3">
                        {needsPayment.map((order) => (
                            <div key={order.id} className="bg-surface border border-yellow-400/30 rounded-lg p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-ivory">{order.barber.name}</p>
                                    <p className="text-muted text-xs mt-0.5">
                                        {order.orderItems?.map((i) => i.service.name).join(", ") || "—"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs border ${paymentStatusColor(order.payement_status)}`}>
                                        {paymentStatusLabel[order.payement_status]}
                                    </span>
                                    <PayButton orderId={order.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-10">
                <h2 className="font-display text-xl text-ivory mb-4">Riwayat Booking</h2>

                {history.length === 0 && (
                    <p className="text-muted text-sm">Belum ada riwayat booking</p>
                )}

                <div className="flex flex-col gap-3">
                    {history.map((order) => (
                        <div key={order.id} className="bg-surface border border-line rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <p className="text-ivory">{order.barber.name}</p>
                                <p className="text-muted text-xs mt-0.5">
                                    {order.orderItems?.map((i) => i.service.name).join(", ") || "—"}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs border ${paymentStatusColor(order.payement_status)}`}>
                                    {paymentStatusLabel[order.payement_status]}
                                </span>
                                <p className="text-muted text-xs mt-1">
                                    {new Date(order.checkin_time).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}