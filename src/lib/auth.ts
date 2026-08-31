import { cookies } from "next/headers";
import axios from "axios";

export interface CurrentUser {
    id: number;
    username: string;
    email?: string;
    role: "ADMIN" | "CUSTOMER";
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return null

    const apiUrl = process.env.API_URL || "http://localhost:3001/api";

    try {
        const res = await axios.get(`${apiUrl}/auth/me`, {
            headers: { Cookie: `token=${token.value}` },
        });
        return res.data.data;
    } catch {
        return null;
    }
}