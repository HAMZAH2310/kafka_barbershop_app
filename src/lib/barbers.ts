import { cookies } from "next/headers";
import axios from "axios";

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

    const apiUrl = process.env.API_URL || "http://localhost:3001/api";

    try {
        const res = await axios.get(`${apiUrl}/barber`, {
            headers: { Cookie: `token=${token.value}` },
        });

        const data = res.data.data;
        return Array.isArray(data) ? data : [];

    } catch {
        return [];
    }
}