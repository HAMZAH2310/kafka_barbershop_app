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

export default function Home() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [href, setHref] = useState("/login")

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
                    setHref("/dashboard-customer")
                }
            } catch {
                setHref("/login")
            }
        }

        checkUser()
    }, [])

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-ink">
            {/* Header di Mobile / Sidebar di Desktop */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-line p-4 md:p-6 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start">
                <div>
                    <h2 className="font-display text-xl md:text-2xl text-ivory">Kafka</h2>
                    <p className="text-[10px] md:text-xs text-muted tracking-widest uppercase mt-0.5 md:mt-1">
                        Barbershop
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 sm:p-10 md:p-16">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ivory leading-tight">
                    Rapikan diri,
                    <br />
                    sesuai standar.
                </h1>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-muted max-w-md">
                    Booking layanan barbershop premium tanpa antri lama. Cukup pilih
                    barber, dan datang tepat waktu.
                </p>

                <Link
                    href={href}
                    className="mt-6 md:mt-8 inline-block cursor-pointer rounded-sm bg-brass px-6 md:px-8 py-3 md:py-3.5 text-xs md:text-sm font-medium uppercase tracking-wider text-ink transition-all hover:bg-brass/90 hover:shadow-lg hover:shadow-brass/20 text-center w-full sm:w-auto"
                >
                    Booking Sekarang
                </Link>

                <section className="mt-10 md:mt-16">
                    <h2 className="font-display text-xl md:text-2xl text-ivory mb-4 md:mb-6">
                        Layanan Kami
                    </h2>

                    {loading && <p className="text-muted text-sm">Memuat layanan...</p>}

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    {!loading && !error && services.length === 0 && (
                        <p className="text-muted text-sm">Belum ada layanan.</p>
                    )}

                    {!loading && services.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="group overflow-hidden rounded-lg border border-line bg-ink/40"
                                >
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-48 sm:h-56 bg-line/30 flex items-center justify-center text-muted text-sm">
                                            No Image
                                        </div>
                                    )}

                                    <div className="p-4">
                                        <h3 className="font-display text-base md:text-lg text-ivory">
                                            {service.name}
                                        </h3>
                                        <p className="text-xs md:text-sm text-muted mt-1">
                                            {service.duration} menit
                                        </p>
                                        <p className="text-brass font-medium text-sm md:text-base mt-2">
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