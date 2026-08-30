import { create } from "zustand";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Order } from "@/lib/orders";

interface QueueInfo {
    queueNumber?: number;
    peopleAhead?: number;
    message: string;
}

interface OrderState {
    orders: Order[];
    queueInfo: QueueInfo | null;
    isLoading: boolean;
    error: string;
    setOrders: (orders: Order[]) => void;
    fetchOrders: () => Promise<void>;
    setQueueInfo: (info: QueueInfo | null) => void;
    fetchQueuePosition: (orderId: number) => Promise<void>;
    applyOrderUpdate: (order: Order) => void;
    updateStatus: (id: number, status: "in_service" | "completed") => Promise<{ success: boolean; message?: string }>;
    syncPaymentStatus: (midtransOrderId: string) => Promise<{ success: boolean; message?: string }>;
    clearError: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    queueInfo: null,
    isLoading: false,
    error: "",

    setOrders: (orders) => set({ orders }),
    setQueueInfo: (info) => set({ queueInfo: info }),

    fetchOrders: async () => {
        try {
            const res = await api.get("/order");
            if (res.data?.data) {
                set({ orders: res.data.data });
            }
        } catch {
            // diamkan, biarkan orders tetap seperti sebelumnya
        }
    },

    fetchQueuePosition: async (orderId) => {
        try {
            const res = await api.get(`/order/${orderId}/queue`);
            set({
                queueInfo: {
                    message: res.data.message,
                    queueNumber: res.data.data?.queueNumber,
                    peopleAhead: res.data.data?.peopleAhead,
                },
            });
        } catch {
            set({ queueInfo: null });
        }
    },

    applyOrderUpdate: (updatedOrder) => {
        set({
            orders: get().orders.map((o) =>
                o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o
            ),
        });
    },

    updateStatus: async (id, status) => {
        const previous = get().orders;

        set({
            orders: previous.map((o) => (o.id === id ? { ...o, service_status: status } : o)),
        });

        try {
            const res = await api.patch(`/order/${id}/status`, { status });
            return { success: true, message: res.data.message };

        } catch (err) {
            set({ orders: previous });
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || "Gagal mengubah status order";
            set({ error: message });
            return { success: false, message };
        }
    },

    syncPaymentStatus: async (midtransOrderId) => {
        try {
            const res = await api.get(`/midtrans/status/${midtransOrderId}`);
            return { success: true, message: res.data.message };

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || "Gagal mengecek status transaksi";
            return { success: false, message };
        }
    },

    clearError: () => set({ error: "" }),
}));