export const barberStatusLabel: Record<string, string> = {
    available: "Tersedia",
    working: "Sedang Kerja",
    on_break: "Istirahat",
};

export function barberStatusColor(status: string) {
    switch (status) {
        case "available": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
        case "working": return "text-brass border-brass/40 bg-brass/10";
        case "on_break": return "text-muted border-line bg-surface";
        default: return "text-muted border-line bg-surface";
    }
}