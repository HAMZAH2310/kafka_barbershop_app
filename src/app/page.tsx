// src/app/page.tsx
import { getDeviceType } from "@/lib/getDevice";
import HomeDesktop from "@/components/home/HomeDekstop";
import HomeMobile from "@/components/home/HomeMobile";

export default async function HomePage() {
  const deviceType = await getDeviceType();
  return deviceType === "mobile" ? <HomeMobile /> : <HomeDesktop />;
}