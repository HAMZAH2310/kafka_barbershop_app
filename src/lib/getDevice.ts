import { headers } from "next/headers";

export async function getDeviceType(): Promise<"mobile" | "desktop"> {
    const headerList = await headers();
    const deviceType = headerList.get("x-device-type");
    return deviceType === "mobile" ? "mobile" : "desktop";
}