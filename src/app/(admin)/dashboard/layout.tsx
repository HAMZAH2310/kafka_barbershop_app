import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMonthlyRevenue } from "@/lib/revenue";
import { getDeviceType } from "@/lib/getDevice";
import Sidebar from "@/components/admin/Sidebar";
import TopbarDesktop from "@/components/admin/TopBarDesktop";
import TopbarMobile from "@/components/admin/TopBarMobile";
import BottomNav from "@/components/admin/BottomTabNavigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user) redirect("/login");
    if (user.role !== "ADMIN") redirect("/customer");

    const [revenue, deviceType] = await Promise.all([
        getMonthlyRevenue(),
        getDeviceType(),
    ]);

    if (deviceType === "mobile") {
        return (
            <div className="min-h-screen bg-ink">
                <TopbarMobile initialUsername={user.username} initialRevenue={revenue?.totalRevenue || 0} />
                <main>{children}</main>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-ink">
            <Sidebar />
            <div className="flex-1">
                <TopbarDesktop initialUsername={user.username} initialRevenue={revenue?.totalRevenue || 0} />
                <main>{children}</main>
            </div>
        </div>
    );
}