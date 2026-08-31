// src/app/customer/layout.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMyProfile } from "@/lib/customerProfile";
import RealtimeProvider from "@/components/customer/RealtimeProvider";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user) redirect("/login");
    if (user.role !== "CUSTOMER") redirect("/dashboard");

    return (
        <RealtimeProvider>
            {children}
        </RealtimeProvider>
    );
}