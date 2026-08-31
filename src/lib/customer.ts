// src/lib/customer.ts
import { cookies } from "next/headers";
import axios from "axios";

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

    const apiUrl = process.env.API_URL || "http://localhost:3001/api";

    try {
        const res = await axios.get(`${apiUrl}/customer`, {
            headers: { Cookie: `token=${token.value}` },
        });

        const data = res.data.data;
        return Array.isArray(data) ? data : [];

    } catch {
        return [];
    }
}