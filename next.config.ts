import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: "/customer",
                destination: "/dashboard-customer",
                permanent: false,
            },
            {
                source: "/customer/onboarding",
                destination: "/onboarding",
                permanent: false,
            },
            {
                source: "/customer/booking",
                destination: "/booking",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
