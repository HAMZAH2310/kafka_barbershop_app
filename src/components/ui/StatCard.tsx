interface StatCardProps {
    label: string;
    value: number | string;
    accent?: boolean;
}

export default function StatCard({ label, value, accent }: StatCardProps) {
    return (
        <div className="bg-surface border border-line rounded-lg p-5">
            <p className="text-muted text-xs uppercase tracking-widest">{label}</p>
            <p className={`font-mono text-3xl mt-2 ${accent ? "text-brass" : "text-ivory"}`}>
                {value}
            </p>
        </div>
    );
}