import { create } from "zustand";
import { AxiosError } from "axios";
import { api } from "@/lib/api";

interface PaymentState {
    isProcessing: boolean;
    error: string;
    payOrder: (orderId: number) => Promise<void>;
    clearError: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
    isProcessing: false,
    error: "",

    payOrder: async (orderId) => {
        set({ isProcessing: true, error: "" });

        try {
            const res = await api.post("/midtrans/create-transaction", { orderId });
            const { snapToken } = res.data.data;

            if (!window.snap) {
                set({ error: "Payment gateway belum siap, coba lagi sebentar", isProcessing: false });
                return;
            }

            window.snap.pay(snapToken, {
                onSuccess: () => {
                    set({ isProcessing: false });
                },
                onPending: () => {
                    set({ isProcessing: false });
                },
                onError: () => {
                    set({ error: "Pembayaran gagal, silakan coba lagi", isProcessing: false });
                },
                onClose: () => {
                    set({ isProcessing: false });
                },
            });

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal memulai pembayaran", isProcessing: false });
        }
    },

    clearError: () => set({ error: "" }),
}));