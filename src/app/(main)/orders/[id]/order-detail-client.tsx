"use client";

import { OrderTracker } from "@/components/orders/order-tracker";
import { StatusSimulator } from "@/components/orders/status-simulator";
import { useOrderSubscription } from "@/hooks/use-order-subscription";
import type { OrderWithDetails } from "@/lib/supabase/types";

interface OrderDetailClientProps {
    initialOrder: OrderWithDetails;
}

export function OrderDetailClient({ initialOrder }: OrderDetailClientProps) {
    const order = useOrderSubscription(initialOrder.id, initialOrder);

    if (!order) return null;

    return (
        <div className="space-y-4">
            <OrderTracker order={order} />
            <StatusSimulator orderId={order.id} currentStatus={order.status} />
        </div>
    );
}
