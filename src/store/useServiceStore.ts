import { create } from "zustand";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Service } from "@/lib/service";

interface ServiceState {
    services: Service[];
    isLoading: boolean;
    error: string;
    setServices: (services: Service[]) => void;
    createService: (formData: FormData) => Promise<boolean>;
    updateService: (id: number, formData: FormData) => Promise<boolean>;
    deleteService: (id: number) => Promise<boolean>;
    clearError: () => void;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
    services: [],
    isLoading: false,
    error: "",

    setServices: (services) => set({ services }),

    createService: async (formData) => {
        set({ isLoading: true, error: "" });
        try {
            const res = await api.post("/service", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set({ services: [res.data.data, ...get().services], isLoading: false });
            return true;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal menambahkan layanan", isLoading: false });
            return false;
        }
    },

    updateService: async (id, formData) => {
        set({ isLoading: true, error: "" });
        try {
            const res = await api.patch(`/service/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set({
                services: get().services.map((s) => (s.id === id ? res.data.data : s)),
                isLoading: false,
            });
            return true;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal memperbarui layanan", isLoading: false });
            return false;
        }
    },

    deleteService: async (id) => {
        set({ isLoading: true, error: "" });
        try {
            await api.delete(`/service/${id}`);
            set({ services: get().services.filter((s) => s.id !== id), isLoading: false });
            return true;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal menghapus layanan", isLoading: false });
            return false;
        }
    },

    clearError: () => set({ error: "" }),
}));