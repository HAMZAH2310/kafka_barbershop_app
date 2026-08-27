import { cookies } from "next/headers";
import { api } from "./api";

export type BarberStatus = "available" | "working" | "on_break";

export interface Barber {
    id: number;
    name: string;
    phone: number;
    picture: string | null;
    status: BarberStatus;
    created_at: string;
}

export async function getBarbers(): Promise<Barber[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return [];

    try {
        const res = await api.get("/barber", {
            headers: { Cookie: `token=${token.value}` }
        });
        return res.data.data;
    } catch {
        return [];
    }
}