import { getDeviceType } from "@/lib/getDevice";
import { getCustomers } from "@/lib/customer";
import CustomerListDesktop from "@/components/admin/customer/CustomerListDesktop";
import CustomerListMobile from "@/components/admin/customer/CustomerListMobile";

export default async function CustomersPage() {
    const [deviceType, customers] = await Promise.all([
        getDeviceType(),
        getCustomers(),
    ]);

    return deviceType === "mobile"
        ? <CustomerListMobile initialCustomers={customers} />
        : <CustomerListDesktop initialCustomers={customers} />;
}