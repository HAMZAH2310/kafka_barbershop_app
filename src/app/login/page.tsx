import { getDeviceType } from "@/lib/getDevice";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginDekstop from "@/components/auth/LoginDekstop";
import LoginMobile from "@/components/auth/LoginMobile";

export default async function LoginPage() {
    const user = await getCurrentUser();
    if (user) {
        redirect(user.role === "ADMIN" ? "/dashboard" : "/customer");
    }

    const deviceType = await getDeviceType();
    return deviceType === "mobile" ? <LoginMobile /> : <LoginDekstop />;
}
