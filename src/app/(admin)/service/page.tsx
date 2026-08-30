import { getDeviceType } from "@/lib/getDevice";
import { getService } from "@/lib/service";
import ServiceListDesktop from "@/components/admin/service/ServiceListDesktop";
import ServiceListMobile from "@/components/admin/service/ServiceListMobile";

export default async function ServicesPage() {
    const [deviceType, services] = await Promise.all([
        getDeviceType(),
        getService(),
    ]);

    return deviceType === "mobile"
        ? <ServiceListMobile initialServices={services} />
        : <ServiceListDesktop initialServices={services} />;
}