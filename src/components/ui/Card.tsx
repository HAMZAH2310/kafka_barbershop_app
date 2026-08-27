export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-surface border border-line rounded-lg p-6 ${className}`}>
            {children}
        </div>
    );
}