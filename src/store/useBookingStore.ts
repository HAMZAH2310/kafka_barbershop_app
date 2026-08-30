import { create } from "zustand";
import { AxiosError } from "axios";
import { api } from "@/lib/api";

interface SelectedService {
    serviceId: number;
    name: string;
    price: number;
    qty: number;
}

interface BookingState {
    selectedBarberId: number | null;
    selectedServices: SelectedService[];
    notes: string;
    isSubmitting: boolean;
    error: string;
    selectBarber: (id: number) => void;
    toggleService: (serviceId: number, name: string, price: number) => void;
    updateQty: (serviceId: number, qty: number) => void;
    setNotes: (notes: string) => void;
    submitBooking: () => Promise<{ success: boolean; message?: string }>;
    reset: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
    selectedBarberId: null,
    selectedServices: [],
    notes: "",
    isSubmitting: false,
    error: "",

    selectBarber: (id) => set({ selectedBarberId: id }),

    toggleService: (serviceId, name, price) => {
        const current = get().selectedServices;
        const exists = current.find((s) => s.serviceId === serviceId);

        if (exists) {
            set({ selectedServices: current.filter((s) => s.serviceId !== serviceId) });
        } else {
            set({ selectedServices: [...current, { serviceId, name, price, qty: 1 }] });
        }
    },

    updateQty: (serviceId, qty) => {
        if (qty < 1) return;
        set({
            selectedServices: get().selectedServices.map((s) =>
                s.serviceId === serviceId ? { ...s, qty } : s
            ),
        });
    },

    setNotes: (notes) => set({ notes }),

    submitBooking: async () => {
        const { selectedBarberId, selectedServices, notes } = get();

        if (!selectedBarberId) {
            set({ error: "Pilih barber terlebih dahulu" });
            return { success: false };
        }

        if (selectedServices.length === 0) {
            set({ error: "Pilih minimal 1 layanan" });
            return { success: false };
        }

        set({ isSubmitting: true, error: "" });

        try {
            const orderRes = await api.post("/order", {
                barberId: selectedBarberId,
                notes,
            });

            const orderId = orderRes.data.data.id;
            const successMessage = orderRes.data.message;

            for (const service of selectedServices) {
                await api.post("/order-item", {
                    orderId,
                    serviceId: service.serviceId,
                    qty: service.qty,
                });
            }

            set({ isSubmitting: false });
            get().reset();
            return { success: true, message: successMessage };

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || "Gagal membuat booking";
            set({ error: message, isSubmitting: false });
            return { success: false, message };
        }
    },

    reset: () => set({ selectedBarberId: null, selectedServices: [], notes: "", error: "" }),
}));