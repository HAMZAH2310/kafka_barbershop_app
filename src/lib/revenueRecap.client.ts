import { api } from "./api";
import { RevenueFilterPeriod, RevenueRecapData } from "@/types/revenue";

export async function getRevenueRecapClient(
    period: RevenueFilterPeriod = "this_month",
    startDate?: string,
    endDate?: string
): Promise<RevenueRecapData> {
    const res = await api.get("/revenue/recap", {
        params: { period, startDate, endDate },
    });

    return res.data.data;
}
