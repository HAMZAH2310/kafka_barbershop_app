import { getDeviceType } from "@/lib/getDevice";
import { getCurrentUser } from "@/lib/auth";
import { getMyOrders } from "@/lib/myOrders";
import DashboardDesktop from "@/components/customer/dashboard/DashboardDekstop";
import DashboardMobile from "@/components/customer/dashboard/DashboardMobile";

export default async function CustomerDashboardPage() {
    const [deviceType, user, orders] = await Promise.all([
        getDeviceType(),
        getCurrentUser(),
        getMyOrders(),
    ]);

    return deviceType === "mobile"
        ? <DashboardMobile username={user?.username || ""} initialOrders={orders} />
        : <DashboardDesktop username={user?.username || ""} initialOrders={orders} />;
}