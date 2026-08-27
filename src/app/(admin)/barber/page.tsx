import { getDeviceType } from "@/lib/getDevice";
import { getBarbers } from "@/lib/barber";
import BarberListDesktop from "@/components/admin/barber/BarberListDesktop";
import BarberListMobile from "@/components/admin/barber/BarberListMobile";

export default async function BarbersPage() {
    const [deviceType, barbers] = await Promise.all([
        getDeviceType(),
        getBarbers(),
    ]);

    return deviceType === "mobile"
        ? <BarberListMobile initialBarbers={barbers} />
        : <BarberListDesktop initialBarbers={barbers} />;
}