import { Suspense } from "react";
import { getDeviceType } from "@/lib/getDevice";
import VerifyEmailDesktop from "@/components/auth/VerifyEmailDesktop";
import VerifyEmailMobile from "@/components/auth/VerifyEmailMobile";

export default async function VerifyEmailPage() {
    const deviceType = await getDeviceType();

    return (
        <Suspense>
            {deviceType === "mobile" ? <VerifyEmailMobile /> : <VerifyEmailDesktop />}
        </Suspense>
    );
}