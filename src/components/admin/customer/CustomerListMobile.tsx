"use client";

import { useState } from "react";
import { useCustomerStore } from "@/store/useCustomerStore";
import { Customer } from "@/lib/customer";
import Button from "@/components/ui/Button";
import CustomerFormModal from "./customerFormModel";

interface Props {
    initialCustomers: Customer[];
}

export default function CustomerListMobile({ initialCustomers }: Props) {
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
        <div className="p-4 pb-20">
            <h1 className="font-display text-2xl text-ivory mb-4">Kelola Customer</h1>

            <Button className="w-full mb-4" onClick={() => { setEditingCustomer(null); setModalOpen(true); }}>
                + Tambah Customer
            </Button>

            <div className="flex flex-col gap-3">
                {customers.length === 0 && (
                    <p className="text-center text-muted text-sm py-10">Belum ada customer</p>
                )}

                {customers.map((customer) => (
                    <div key={customer.id} className="bg-surface border border-line rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-ink border border-line overflow-hidden flex-shrink-0">
                                {customer.profilePicture && (
                                    <img src={customer.profilePicture} alt={customer.name} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-ivory font-medium truncate">{customer.name}</p>
                                <p className="text-muted text-xs truncate">{customer.email}</p>
                                <p className="text-muted text-xs">{customer.phone}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-3 pt-3 border-t border-line">
                            <button onClick={() => handleEdit(customer)} className="text-muted hover:text-brass text-xs transition-colors">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(customer.id)} className="text-muted hover:text-red-400 text-xs transition-colors">
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <CustomerFormModal customer={editingCustomer} onClose={() => setModalOpen(false)} />
            )}
        </div>
    );
}