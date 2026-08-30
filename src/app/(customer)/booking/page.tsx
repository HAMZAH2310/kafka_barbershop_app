
import { getDeviceType } from "@/lib/getDevice";
import { getBarbers } from "@/lib/barbers";
import { getService } from "@/lib/service";
import BookingDesktop from "@/components/customer/booking/BookingDesktop";
import BookingMobile from "@/components/customer/booking/BookingMobile";

export default async function BookingPage() {
    const [deviceType, barbers, services] = await Promise.all([
        getDeviceType(),
        getBarbers(),
        getService(),
    ]);

    return deviceType === "mobile"
        ? <BookingMobile barbers={barbers} services={services} />
        : <BookingDesktop barbers={barbers} services={services} />;
}