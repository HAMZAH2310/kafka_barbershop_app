interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "outline";
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export default function Button({
    children, onClick, variant = "primary", className = "", type = "button", disabled,
}: ButtonProps) {
    const base = "rounded-md px-5 py-2.5 font-body text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-brass text-ink hover:bg-brass-light",
        outline: "border border-line text-ivory hover:border-brass hover:text-brass",
    };

    return (
        <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
}