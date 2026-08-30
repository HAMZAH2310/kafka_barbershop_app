import { cookies } from "next/headers";
import { api } from "./api";

export interface Service {
    id: number;
    name: string;
    duration: number;
    price: number;
    image: string | null;
    created_at: string;
}

export async function getService() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return [];


    try {
        const res = await api.get("/service", {
            headers: { Cookie: `token=${token.value}` }
        });
        return res.data.data
    } catch {
        return [];
    }
}