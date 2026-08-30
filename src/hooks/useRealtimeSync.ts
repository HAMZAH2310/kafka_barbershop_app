"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useOrderStore } from "@/store/useOrderStore";
import { useBarberStore } from "@/store/useBarberStore";
import { Order } from "@/lib/orders";
import { Barber } from "@/lib/barbers";

export function useRealtimeSync() {
    const applyOrderUpdate = useOrderStore((state) => state.applyOrderUpdate);
    const applyBarberUpdate = useBarberStore((state) => state.applyBarberUpdate);

    useEffect(() => {
        const socket = getSocket();
        socket.connect();

        socket.on("order:statusUpdated", (order: Order) => {
            applyOrderUpdate(order);
        });

        socket.on("barber:statusUpdated", (barber: Barber) => {
            applyBarberUpdate(barber);
        });

        return () => {
            socket.off("order:statusUpdated");
            socket.off("barber:statusUpdated");
            socket.disconnect();
        };
    }, [applyOrderUpdate, applyBarberUpdate]);
}