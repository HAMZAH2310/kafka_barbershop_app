"use client";

import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";
import { Barber } from "@/lib/barbers";
import { Service } from "@/lib/service";
import BarberSelector from "./BarberSelector";
import ServiceSelector from "./ServiceSelector";
import BookingSummary from "./BookingSummary";
import Button from "@/components/ui/Button";

interface Props {
    barbers: Barber[];
    services: Service[];
}

export default function BookingDesktop({ barbers, services }: Props) {
    const router = useRouter();
    const { notes, setNotes, isSubmitting, error, submitBooking } = useBookingStore();

    const handleSubmit = async () => {
        const result = await submitBooking();
        if (result.success) {
            router.push("/dashboard-customer");
            router.refresh();
        }
    };

    return (
        <div className="p-10 max-w-3xl mx-auto">
            <h1 className="font-display text-3xl text-ivory">Booking Layanan</h1>
            <p className="text-muted text-sm mt-1 mb-8">Pilih barber dan layanan yang kamu inginkan</p>

            {error && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-md px-3 py-2 mb-6">
                    {error}
                </p>
            )}

            <h2 className="text-ivory font-medium mb-3">1. Pilih Barber</h2>
            <BarberSelector initialBarbers={barbers} />

            <h2 className="text-ivory font-medium mb-3 mt-8">2. Pilih Layanan</h2>
            <ServiceSelector services={services} />

            <h2 className="text-ivory font-medium mb-3 mt-8">3. Catatan (opsional)</h2>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-surface border border-line rounded-md px-4 py-2.5 text-ivory focus:outline-none focus:border-brass resize-none"
                placeholder="Misal: model rambut yang diinginkan"
            />

            <BookingSummary />

            <Button className="w-full mt-6" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Memproses..." : "Konfirmasi Booking"}
            </Button>
        </div>
    );
}