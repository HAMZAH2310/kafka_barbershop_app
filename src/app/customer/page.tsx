import { getDeviceType } from "@/lib/getDevice";
import DashboardDesktop from "@/components/customer/DashboardDekstop";
import DashboardMobile from "@/components/customer/DashboardMobile";

export default async function CustomerPage() {
    const deviceType = await getDeviceType();
    return deviceType === "mobile" ? <DashboardMobile /> : <DashboardDesktop />;
}