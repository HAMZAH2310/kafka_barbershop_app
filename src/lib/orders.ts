import { cookies } from "next/headers";
import axios from "axios";

export interface OrderItem {
    id: number;
    qty: number;
    subtotal: number;
    service: { name: string };
}

export interface Order {
    id: number;
    queueNumber: number | null;
    service_status: "waiting" | "in_service" | "completed";
    payement_status: "unpaid" | "pending" | "paid" | "failed" | "expired" | "cancelled";
    notes: string;
    checkin_time: string;
    customer: { name: string };
    barber: { name: string };
    orderItems?: OrderItem[];
}

export async function getOrders(): Promise<Order[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return [];

    const apiUrl = process.env.API_URL || "http://localhost:3001/api";

    try {
        const res = await axios.get(`${apiUrl}/order`, {
            headers: { Cookie: `token=${token.value}` },
        });

        return res.data.data;

    } catch {
        return [];
    }
}