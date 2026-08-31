export const serviceStatusLabel: Record<string, string> = {
    waiting: "Menunggu",
    in_service: "Sedang Dilayani",
    completed: "Selesai",
    cancelled: "Dibatalkan",
};

export const paymentStatusLabel: Record<string, string> = {
    unpaid: "Belum Bayar",
    pending: "Menunggu Bayar",
    paid: "Lunas",
    failed: "Gagal",
    expired: "Kadaluarsa",
    cancelled: "Dibatalkan",
};

export function serviceStatusColor(status: string) {
    switch (status) {
        case "waiting": return "text-muted border-line bg-surface";
        case "in_service": return "text-brass border-brass/40 bg-brass/10";
        case "completed": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
        case "cancelled": return "text-red-400 border-red-400/30 bg-red-400/10";   // tambahkan
        default: return "text-muted border-line bg-surface";
    }
}

export function paymentStatusColor(status: string) {
    switch (status) {
        case "paid": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
        case "pending": return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
        case "unpaid": return "text-muted border-line bg-surface";
        case "failed":
        case "expired":
        case "cancelled": return "text-red-400 border-red-400/30 bg-red-400/10";
        default: return "text-muted border-line bg-surface";
    }
}