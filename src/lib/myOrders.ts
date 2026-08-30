import { cookies } from "next/headers";
import { api } from "./api";
import { Order } from "./orders";

export async function getMyOrders(): Promise<Order[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return [];

    try {
        const res = await api.get(`/order`, {
            headers: { Cookie: `token=${token.value}` },
        });
        return res.data.data;

    } catch {
        return [];
    }
}