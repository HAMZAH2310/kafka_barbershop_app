export type RevenueFilterPeriod = "today" | "this_week" | "this_month" | "this_year" | "all_time" | "custom";

export interface RevenueSummary {
    totalRevenue: number;
    totalTransactions: number;
    averageOrderValue: number;
    totalServices: number;
}

export interface PaymentMethodBreakdown {
    method: string;
    label: string;
    count: number;
    revenue: number;
    percentage: number;
}

export interface BarberBreakdown {
    barberId: number;
    barberName: string;
    orderCount: number;
    revenue: number;
}

export interface ServiceBreakdown {
    serviceId: number;
    serviceName: string;
    quantity: number;
    revenue: number;
}

export interface DailyRevenue {
    date: string;
    revenue: number;
    transactions: number;
}

export interface TransactionDetail {
    invoiceId: number;
    invoiceNo: string;
    orderId: number;
    customerName: string;
    barberName: string;
    serviceNames: string[];
    paymentMethod: string;
    totalAmount: number;
    paidAt: string;
}

export interface RevenueRecapData {
    period: {
        type: RevenueFilterPeriod;
        from: string;
        to: string;
    };
    summary: RevenueSummary;
    byPaymentMethod: PaymentMethodBreakdown[];
    byBarber: BarberBreakdown[];
    byService: ServiceBreakdown[];
    dailyTrend: DailyRevenue[];
    recentTransactions: TransactionDetail[];
}
