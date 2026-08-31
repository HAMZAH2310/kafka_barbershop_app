import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMyProfile } from "@/lib/customerProfile";
import OnboardingForm from "@/components/customer/onboarding/OnBoardingForm";

export default async function OnboardingPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const profile = await getMyProfile();
    if (profile) redirect("/dashboard-customer");

    return <OnboardingForm username={user.username} email={user.email || ""} />;
}