import { getDeviceType } from "@/lib/getDevice";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterDekstop from "@/components/auth/RegisterDekstop";
import RegisterMobile from "@/components/auth/RegisterMobile";

export default async function RegisterPage() {
    const user = await getCurrentUser();
    if (user) {
        redirect(user.role === "ADMIN" ? "/dashboard" : "/dashboard-customer");
    }

    const deviceType = await getDeviceType();
    return deviceType === "mobile" ? <RegisterMobile /> : <RegisterDekstop />;
}
