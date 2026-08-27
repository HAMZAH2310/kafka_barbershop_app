import { create } from "zustand";

interface RevenueData {
    totalRevenue: number;
    totalTransactions: number;
}

interface RevenueState {
    revenue: RevenueData;
    setRevenue: (data: RevenueData) => void;
}

export const useRevenueStore = create<RevenueState>((set) => ({
    revenue: { totalRevenue: 0, totalTransactions: 0 },
    setRevenue: (data) => set({ revenue: data }),
}));