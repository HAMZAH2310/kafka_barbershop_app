"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import Link from "next/link"

interface Service {
    id: number | string
    name: string
    duration: number
    price: number
    image?: string
}

export default function HomeDesktop() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [href, setHref] = useState("/login")

    // Fetch services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true)
                setError(null)

                const res = await api.get("/service")
                const data = res.data?.data ?? res.data ?? []

                setServices(Array.isArray(data) ? data : [])
            } catch (err: any) {
                console.error("Gagal fetch services:", err)
                setError(err?.response?.data?.message || "Gagal memuat layanan")
            } finally {
                setLoading(false)
            }
        }

        fetchServices()
    }, [])

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await api.get("/auth/me")
                const role = res.data?.data?.role

                if (role === "ADMIN") {
                    setHref("/dashboard")
                } else {
                    setHref("/customer")
                }
            } catch {
                setHref("/login")
            }
        }

        checkUser()
    }, [])

    return (
        <div className="flex min-h-screen bg-ink">
            <aside className="w-64 border-r border-line p-6 flex flex-col">
                <h2 className="font-display text-2xl text-ivory">Kafka</h2>
                <p className="text-xs text-muted tracking-widest uppercase mt-1">
                    Barbershop
                </p>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-16">
                <h1 className="font-display text-5xl text-ivory leading-tight">
                    Rapikan diri,
                    <br />
                    sesuai standar.
                </h1>
                <p className="mt-4 text-muted max-w-md">
                    Booking layanan barbershop premium tanpa antri lama. Cukup pilih
                    barber, dan datang tepat waktu.
                </p>

                <Link
                    href={href}
                    className="mt-8 inline-block cursor-pointer rounded-sm bg-brass px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-ink transition-all hover:bg-brass/90 hover:shadow-lg hover:shadow-brass/20"
                >
                    Booking Sekarang
                </Link>

                <section className="mt-16">
                    <h2 className="font-display text-2xl text-ivory mb-6">
                        Layanan Kami
                    </h2>

                    {loading && <p className="text-muted">Memuat layanan...</p>}

                    {error && <p className="text-red-400">{error}</p>}

                    {!loading && !error && services.length === 0 && (
                        <p className="text-muted">Belum ada layanan.</p>
                    )}

                    {!loading && services.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="group overflow-hidden rounded-lg border border-line bg-ink/40"
                                >
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-56 bg-line/30 flex items-center justify-center text-muted text-sm">
                                            No Image
                                        </div>
                                    )}

                                    <div className="p-4">
                                        <h3 className="font-display text-lg text-ivory">
                                            {service.name}
                                        </h3>
                                        <p className="text-sm text-muted mt-1">
                                            {service.duration} menit
                                        </p>
                                        <p className="text-brass font-medium mt-2">
                                            Rp {service.price.toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}