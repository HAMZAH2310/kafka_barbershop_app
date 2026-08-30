import { cookies } from "next/headers";
import { api } from "./api";

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: number;
    profilePicture: string | null;
    created_at: string;
}

export async function getCustomers(): Promise<Customer[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return [];

    try {
        const res = await api.get("/customer", {
            headers: { Cookie: `token=${token.value}` },
        });
        return res.data.data;

    } catch {
        return [];
    }
}
