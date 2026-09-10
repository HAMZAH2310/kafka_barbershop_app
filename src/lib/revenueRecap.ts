import { cookies } from "next/headers";
import axios from "axios";
import { RevenueFilterPeriod, RevenueRecapData } from "@/types/revenue";

export async function getRevenueRecapServer(
    period: RevenueFilterPeriod = "this_month",
    startDate?: string,
    endDate?: string
): Promise<RevenueRecapData | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return null;

    const apiUrl = process.env.API_URL || "http://localhost:3001/api";

    try {
        const res = await axios.get(`${apiUrl}/revenue/recap`, {
            headers: { Cookie: `token=${token.value}` },
            params: { period, startDate, endDate },
        });

        return res.data?.data || null;
    } catch {
        return null;
    }
}
