import { create } from "zustand";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Customer } from "@/lib/customer";

interface CustomerState {
    customers: Customer[];
    isLoading: boolean;
    error: string;
    setCustomers: (customers: Customer[]) => void;
    createCustomer: (formData: FormData) => Promise<boolean>;
    updateCustomer: (id: number, formData: FormData) => Promise<boolean>;
    deleteCustomer: (id: number) => Promise<boolean>;
    clearError: () => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
    customers: [],
    isLoading: false,
    error: "",

    setCustomers: (customers) => set({ customers }),

    createCustomer: async (formData) => {
        set({ isLoading: true, error: "" });
        try {
            const res = await api.post("/customer", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set({ customers: [res.data.data, ...get().customers], isLoading: false });
            return true;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal menambahkan customer", isLoading: false });
            return false;
        }
    },

    updateCustomer: async (id, formData) => {
        set({ isLoading: true, error: "" });
        try {
            const res = await api.patch(`/customer/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set({
                customers: get().customers.map((c) => (c.id === id ? res.data.data : c)),
                isLoading: false,
            });
            return true;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal memperbarui customer", isLoading: false });
            return false;
        }
    },

    deleteCustomer: async (id) => {
        set({ isLoading: true, error: "" });
        try {
            await api.delete(`/customer/${id}`);
            set({ customers: get().customers.filter((c) => c.id !== id), isLoading: false });
            return true;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal menghapus customer", isLoading: false });
            return false;
        }
    },

    clearError: () => set({ error: "" }),
}));