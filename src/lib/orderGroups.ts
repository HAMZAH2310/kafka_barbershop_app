import { Order } from "./orders";

export interface GroupedOrders {
    active: Order | null;
    needsPayment: Order[];
    history: Order[];
}

export function groupOrders(orders: Order[]): GroupedOrders {
    const active = orders.find((o) => o.service_status !== "completed") || null;

    const completed = orders.filter((o) => o.service_status === "completed");

    const needsPayment = completed.filter((o) => o.payement_status !== "paid");
    const history = completed.filter((o) => o.payement_status === "paid");

    return { active, needsPayment, history };
}