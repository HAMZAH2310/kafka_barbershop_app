import { getDeviceType } from "@/lib/getDevice";
import { getOrders } from "@/lib/orders";
import DashboardDesktop from "@/components/admin/DashboardDekstop";
import DashboardMobile from "@/components/admin/DashboardMobile";

export default async function AdminDashboardPage() {
    const [deviceType, orders] = await Promise.all([
        getDeviceType(),
        getOrders(),
    ]);

    return deviceType === "mobile"
        ? <DashboardMobile orders={orders} />
        : <DashboardDesktop orders={orders} />;
}