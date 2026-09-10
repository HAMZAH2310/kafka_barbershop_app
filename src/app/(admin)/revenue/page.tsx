import { getDeviceType } from "@/lib/getDevice";
import { getRevenueRecapServer } from "@/lib/revenueRecap";
import RevenueRecapDesktop from "@/components/admin/revenue/RevenueRecapDesktop";
import RevenueRecapMobile from "@/components/admin/revenue/RevenueRecapMobile";

export default async function RevenuePage() {
    const [deviceType, initialData] = await Promise.all([
        getDeviceType(),
        getRevenueRecapServer("this_month"),
    ]);

    return deviceType === "mobile" ? (
        <RevenueRecapMobile initialData={initialData} />
    ) : (
        <RevenueRecapDesktop initialData={initialData} />
    );
}
