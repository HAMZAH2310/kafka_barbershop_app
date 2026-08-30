// src/app/(admin)/orders/page.tsx
import { getDeviceType } from "@/lib/getDevice";
import { getOrders } from "@/lib/orders";
import OrderListDesktop from "@/components/admin/order/OrderListDesktop";
import OrderListMobile from "@/components/admin/order/OrderListMobile";

export default async function OrdersPage() {
    const [deviceType, orders] = await Promise.all([
        getDeviceType(),
        getOrders(),
    ]);

    return deviceType === "mobile"
        ? <OrderListMobile initialOrders={orders} />
        : <OrderListDesktop initialOrders={orders} />;
}