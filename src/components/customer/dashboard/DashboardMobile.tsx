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

export default function DashboardMobile({ username, initialOrders }: Props) {
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
        <div className="p-4 pb-20">
            <h1 className="font-display text-2xl text-ivory">Halo, {username}</h1>
            <p className="text-muted text-sm mt-1 mb-5">Selamat datang kembali</p>

            {active ? (
                <QueueStatusCard order={active} />
            ) : (
                <div className="bg-surface border border-line rounded-lg p-6 text-center">
                    <p className="text-ivory">Belum ada booking aktif</p>
                    <p className="text-muted text-sm mt-1 mb-4">Yuk pesan layanan sekarang</p>
                    <Link href="/booking">
                        <Button className="w-full">Booking Sekarang</Button>
                    </Link>
                </div>
            )}

            {needsPayment.length > 0 && (
                <>
                    <h2 className="font-display text-lg text-ivory mt-8 mb-1">Menunggu Pembayaran</h2>
                    <p className="text-muted text-xs mb-3">Segera selesaikan pembayaran</p>

                    <div className="flex flex-col gap-3">
                        {needsPayment.map((order) => (
                            <div key={order.id} className="bg-surface border border-yellow-400/30 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <p className="text-ivory text-sm">{order.barber.name}</p>
                                    <span className={`px-2 py-0.5 rounded-full text-[11px] border ${paymentStatusColor(order.payement_status)}`}>
                                        {paymentStatusLabel[order.payement_status]}
                                    </span>
                                </div>
                                <p className="text-muted text-xs mt-1 mb-3">
                                    {order.orderItems?.map((i) => i.service.name).join(", ") || "—"}
                                </p>
                                <PayButton orderId={order.id} />
                            </div>
                        ))}
                    </div>
                </>
            )}

            <h2 className="font-display text-lg text-ivory mt-8 mb-3">Riwayat Booking</h2>

            {history.length === 0 && (
                <p className="text-muted text-sm">Belum ada riwayat booking</p>
            )}

            <div className="flex flex-col gap-3">
                {history.map((order) => (
                    <div key={order.id} className="bg-surface border border-line rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <p className="text-ivory text-sm">{order.barber.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[11px] border ${paymentStatusColor(order.payement_status)}`}>
                                {paymentStatusLabel[order.payement_status]}
                            </span>
                        </div>
                        <p className="text-muted text-xs mt-1">
                            {order.orderItems?.map((i) => i.service.name).join(", ") || "—"}
                        </p>
                        <p className="text-muted text-[11px] mt-1">
                            {new Date(order.checkin_time).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}