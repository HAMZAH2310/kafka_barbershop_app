import { cookies } from "next/headers";
import axios from "axios";

export interface QueueInfo {
    message: string;
    queueNumber?: number;
    peopleAhead?: number;
}

export async function getQueuePosition(orderId: number): Promise<QueueInfo | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return null;

    const apiUrl = process.env.API_URL || "http://localhost:3001/api";

    try {
        const res = await axios.get(`${apiUrl}/order/${orderId}/queue`, {
            headers: { Cookie: `token=${token.value}` },
        });

        return {
            message: res.data.message,
            queueNumber: res.data.data?.queueNumber,
            peopleAhead: res.data.data?.peopleAhead,
        };

    } catch {
        return null;
    }
}