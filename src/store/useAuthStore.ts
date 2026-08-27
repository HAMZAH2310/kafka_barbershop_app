import { create } from "zustand";
import { AxiosError } from "axios";
import { api } from "@/lib/api";

export interface User {
    id: number;
    username: string;
    role: "ADMIN" | "CUSTOMER";
}

export type VerifyStatus = "idle" | "loading" | "success" | "error" | "expired";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string;
    success: string;
    verifyStatus: VerifyStatus;
    verifyMessage: string;
    login: (username: string, password: string) => Promise<User | null>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    verifyEmail: (token: string) => Promise<void>;
    resendVerification: (email: string) => Promise<boolean>;
    logout: () => Promise<void>;
    fetchProfile: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: "",
    success: "",
    verifyStatus: "idle",
    verifyMessage: "",

    login: async (username, password) => {
        set({ isLoading: true, error: "" });
        try {
            const res = await api.post("/auth/login", { username, password });
            set({ user: res.data.data, isLoading: false });
            return res.data.data as User;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Tidak bisa terhubung ke server", isLoading: false });
            return null;
        }
    },

    register: async (username, email, password) => {
        set({ isLoading: true, error: "", success: "" });
        try {
            await api.post("/auth/register", { username, email, password, role: "CUSTOMER" });
            set({ isLoading: false, success: "Registrasi berhasil. Silakan cek email untuk verifikasi akun." });
            return true;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Tidak bisa terhubung ke server", isLoading: false });
            return false;
        }
    },

    verifyEmail: async (token: string) => {
        set({ verifyStatus: "loading", verifyMessage: "" });

        try {
            const res = await api.get(`/auth/verify-email?token=${token}`);
            set({ verifyStatus: "success", verifyMessage: res.data.message });

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || "Verifikasi gagal, silakan coba lagi";
            const isExpired = message.toLowerCase().includes("kadaluarsa");

            set({
                verifyStatus: isExpired ? "expired" : "error",
                verifyMessage: message,
            });
        }
    },

    resendVerification: async (email: string) => {
        set({ isLoading: true, error: "", success: "" });
        try {
            const res = await api.post("/auth/resend-verification", { email });
            set({ isLoading: false, success: res.data.message });
            return true;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            set({ error: error.response?.data?.message || "Gagal mengirim ulang email", isLoading: false });
            return false;
        }
    },

    logout: async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            set({ user: null });
        }
    },

    fetchProfile: async () => {
        try {
            const res = await api.get("/auth/me");
            set({ user: res.data.data });
        } catch {
            set({ user: null });
        }
    },

    clearError: () => set({ error: "", success: "" }),
}));