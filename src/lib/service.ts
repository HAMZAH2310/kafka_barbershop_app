import { cookies } from "next/headers";
import axios from "axios";

export interface Service {
    id: number;
    name: string;
    duration: number;
    price: number;
    image: string | null;
    created_at: string;
    isActive: boolean;
}

export async function getService(includeInactive = false): Promise<Service[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return [];

    const apiUrl = process.env.API_URL || "http://localhost:3001/api";

    try {
        const res = await axios.get(
            `${apiUrl}/service${includeInactive ? "?includeInactive=true" : ""}`,
            { headers: { Cookie: `token=${token.value}` } }
        );
        return res.data.data;

    } catch {
        return [];
    }
}