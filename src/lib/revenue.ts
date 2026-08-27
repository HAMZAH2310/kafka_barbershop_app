import { cookies } from "next/headers";
import axios from "axios";

export interface MonthlyRevenue {
    totalRevenue: number;
    totalTransactions: number;
    period: { from: string; to: string };
}

export async function getMonthlyRevenue(): Promise<MonthlyRevenue | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return null;

    const apiUrl = process.env.API_URL || "http://localhost:3001/api";

    try {
        const res = await axios.get(`${apiUrl}/midtrans/revenue/monthly`, {
            headers: { Cookie: `token=${token.value}` },
        });
        return res.data.data;

    } catch {
        return null;
    }
}