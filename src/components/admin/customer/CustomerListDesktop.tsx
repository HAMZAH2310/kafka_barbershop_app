"use client";

import { useState } from "react";
import { useCustomerStore } from "@/store/useCustomerStore";
import { Customer } from "@/lib/customer";
import Button from "@/components/ui/Button";
import CustomerFormModal from "./customerFormModel";

interface Props {
    initialCustomers: Customer[];
}

export default function CustomerListDesktop({ initialCustomers }: Props) {
    const { customers, setCustomers, deleteCustomer } = useCustomerStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    useState(() => {
        setCustomers(initialCustomers);
    });

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Yakin ingin menghapus customer ini?")) {
            await deleteCustomer(id);
        }
    };

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl text-ivory">Kelola Customer</h1>
                    <p className="text-muted text-sm mt-1">Daftar pelanggan yang terdaftar</p>
                </div>
                <Button onClick={() => { setEditingCustomer(null); setModalOpen(true); }}>
                    + Tambah Customer
                </Button>
            </div>

            <div className="bg-surface border border-line rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-line text-left text-muted text-xs uppercase tracking-widest">
                            <th className="px-5 py-3 font-normal">Foto</th>
                            <th className="px-5 py-3 font-normal">Nama</th>
                            <th className="px-5 py-3 font-normal">Email</th>
                            <th className="px-5 py-3 font-normal">No. HP</th>
                            <th className="px-5 py-3 font-normal text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                                    Belum ada customer
                                </td>
                            </tr>
                        )}
                        {customers.map((customer) => (
                            <tr key={customer.id} className="border-b border-line last:border-0 hover:bg-ink/40 transition-colors">
                                <td className="px-5 py-3">
                                    <div className="w-10 h-10 rounded-full bg-ink border border-line overflow-hidden">
                                        {customer.profilePicture && (
                                            <img src={customer.profilePicture} alt={customer.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-ivory">{customer.name}</td>
                                <td className="px-5 py-3 text-muted">{customer.email}</td>
                                <td className="px-5 py-3 text-muted">{customer.phone}</td>
                                <td className="px-5 py-3 text-right">
                                    <button onClick={() => handleEdit(customer)} className="text-muted hover:text-brass text-xs mr-4 transition-colors">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(customer.id)} className="text-muted hover:text-red-400 text-xs transition-colors">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <CustomerFormModal customer={editingCustomer} onClose={() => setModalOpen(false)} />
            )}
        </div>
    );
}