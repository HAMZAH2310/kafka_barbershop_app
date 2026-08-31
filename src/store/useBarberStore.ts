import { create } from "zustand";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Barber, BarberStatus } from "@/lib/barbers";

interface BarberState {
    barbers: Barber[];
    isLoading: boolean;
    error: string;
    setBarbers: (barbers: Barber[]) => void;
    createBarber: (formData: FormData) => Promise<boolean>;
    updateBarber: (id: number, formData: FormData) => Promise<boolean>;
    updateStatus: (id: number, status: BarberStatus) => Promise<boolean>;
    deleteBarber: (id: number) => Promise<boolean>;
    applyBarberUpdate: (updatedBarber: Barber) => void;
    clearError: () => void;
}

export const useBarberStore = create<BarberState>((set, get) => ({
    barbers: [],
    isLoading: false,
    error: "",

    setBarbers: (barbers) => set({ barbers }),

    createBarber: async (formData) => {
        set({ isLoading: true, error: "" });
        try {
            const res = await api.post("/barber", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set({ barbers: [res.data.data, ...get().barbers], isLoading: false });
            return true;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal menambahkan barber", isLoading: false });
            return false;
        }
    },

    updateBarber: async (id, formData) => {
        set({ isLoading: true, error: "" });
        try {
            const res = await api.patch(`/barber/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set({
                barbers: get().barbers.map((b) => (b.id === id ? res.data.data : b)),
                isLoading: false,
            });
            return true;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal memperbarui barber", isLoading: false });
            return false;
        }
    },

    updateStatus: async (id, status) => {
        const previous = get().barbers;
        set({
            barbers: previous.map((b) => (b.id === id ? { ...b, status } : b)),
        });

        try {
            await api.patch(`/barber/${id}/status`, { status });
            return true;

        } catch (err) {
            set({ barbers: previous });
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal mengubah status" });
            return false;
        }
    },

    deleteBarber: async (id) => {
        set({ isLoading: true, error: "" });
        try {
            await api.delete(`/barber/${id}`);
            set({ barbers: get().barbers.filter((b) => b.id !== id), isLoading: false });
            return true;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal menghapus barber", isLoading: false });
            return false;
        }
    },

    applyBarberUpdate: (updatedBarber: Barber) => {
        set({
            barbers: get().barbers.map((b) =>
                b.id === updatedBarber.id ? { ...b, ...updatedBarber } : b
            ),
        });
    },

    clearError: () => set({ error: "" }),
}));