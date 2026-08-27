"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
    { href: "/dashboard", label: "Order" },
    { href: "/barber", label: "Barber" },
    { href: "/services", label: "Layanan" },
    { href: "/customers", label: "Customer" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-line flex justify-around py-3 z-40">
            {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`text-xs transition-colors ${isActive ? "text-brass" : "text-muted"}`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}