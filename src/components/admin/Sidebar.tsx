"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
    { href: "/dashboard", label: "Order" },
    { href: "/barber", label: "Barber" },
    { href: "/services", label: "Layanan" },
    { href: "/customers", label: "Customer" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-line p-6 flex flex-col min-h-screen">
            <div className="mb-10">
                <h2 className="font-display text-2xl text-ivory">Kafka</h2>
                <p className="text-xs text-muted tracking-widest uppercase mt-1">Barbershop</p>
            </div>

            <nav className="flex flex-col gap-1">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-3 py-2.5 rounded-md text-sm transition-colors ${isActive
                                ? "bg-brass/10 text-brass border-l-2 border-brass"
                                : "text-ivory/70 hover:text-ivory hover:bg-surface border-l-2 border-transparent"
                                }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}