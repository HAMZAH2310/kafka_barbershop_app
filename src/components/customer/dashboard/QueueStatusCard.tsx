"use client";

import { useEffect } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { Order } from "@/lib/orders";
import { serviceStatusLabel, serviceStatusColor } from "@/lib/orderStatus";

interface Props {
    order: Order;
}

export default function QueueStatusCard({ order }: Props) {
    const { queueInfo, fetchQueuePosition } = useOrderStore();


    useEffect(() => {
        if (order.service_status === "waiting") {
            fetchQueuePosition(order.id);
        }
    }, [order.service_status, order.id, fetchQueuePosition]);

    return (
        <div className="bg-surface border border-brass/40 rounded-lg p-6 transition-colors">
            <p className="text-muted text-xs uppercase tracking-widest">Booking Aktif</p>

            <div className="flex items-center justify-between mt-3">
                <div>
                    <p className="text-ivory text-lg">Barber: {order.barber.name}</p>
                    <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs border transition-colors ${serviceStatusColor(order.service_status)}`}>
                        {serviceStatusLabel[order.service_status]}
                    </span>
                </div>

                {order.queueNumber && (
                    <div className="text-right">
                        <p className="text-muted text-xs uppercase tracking-widest">Nomor Antrian</p>
                        <p className="font-mono text-brass text-4xl">#{order.queueNumber}</p>
                    </div>
                )}
            </div>

            {order.service_status === "waiting" && queueInfo && (
                <div className="mt-5 pt-5 border-t border-line">
                    {queueInfo.peopleAhead !== undefined ? (
                        <div className="flex items-center justify-between">
                            <p className="text-ivory text-sm">
                                {queueInfo.peopleAhead === 0
                                    ? "Kamu berikutnya!"
                                    : `${queueInfo.peopleAhead} orang di depan kamu`}
                            </p>
                            {queueInfo.peopleAhead > 0 && (
                                <span className="font-mono text-muted text-sm">
                                    ~{queueInfo.peopleAhead * 20} menit
                                </span>
                            )}
                        </div>
                    ) : (
                        <p className="text-muted text-sm">{queueInfo.message}</p>
                    )}
                </div>
            )}

            {order.service_status === "in_service" && (
                <div className="mt-5 pt-5 border-t border-line">
                    <p className="text-brass text-sm">✂️ Giliran kamu sedang dilayani sekarang</p>
                </div>
            )}
        </div>
    );
}