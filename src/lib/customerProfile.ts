
import { cookies } from "next/headers";
import { api } from "./api";

export interface CustomerProfile {
    id: number;
    name: string;
    email: string;
    phone: number;
    profilePicture: string | null;
}

export async function getMyProfile(): Promise<CustomerProfile | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return null;

    try {
        const res = await api.get(`/customer`, {
            headers: { Cookie: `token=${token.value}` },
        });
        return res.data.data;

    } catch {
        return null;
    }
}