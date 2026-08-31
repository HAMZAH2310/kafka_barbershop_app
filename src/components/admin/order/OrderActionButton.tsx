"use client";

import { useState } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import Button from "@/components/ui/Button";

interface Props {
    orderId: number;
    currentStatus: "waiting" | "in_service" | "completed" | "cancelled";
}

const NEXT_STATUS: Record<string, "in_service" | "completed" | null> = {
    waiting: "in_service",
    in_service: "completed",
    completed: null,
};

const BUTTON_LABEL: Record<string, string> = {
    waiting: "Mulai Layani",
    in_service: "Tandai Selesai",
};

export default function OrderActionButton({ orderId, currentStatus }: Props) {
    const { updateStatus } = useOrderStore();
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    const nextStatus = NEXT_STATUS[currentStatus];

    if (!nextStatus) {
        return <span className="text-muted text-xs">Selesai</span>;
    }

    const handleClick = async () => {
        setLoading(true);
        setFeedback("");

        const result = await updateStatus(orderId, nextStatus);

        if (result.message) {
            setFeedback(result.message);
            setTimeout(() => setFeedback(""), 4000);
        }

        setLoading(false);
    };

    return (
        <div>
            <Button
                variant="outline"
                className="text-xs px-3 py-1.5"
                onClick={handleClick}
                disabled={loading}
            >
                {loading ? "Memproses..." : BUTTON_LABEL[currentStatus]}
            </Button>
            {feedback && (
                <p className="text-xs text-brass mt-1 max-w-[180px]">{feedback}</p>
            )}
        </div>
    );
}