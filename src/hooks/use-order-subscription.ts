"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrderWithDetails, Order } from "@/lib/supabase/types";

export function useOrderSubscription(orderId: string, initialOrder: OrderWithDetails | null) {
    const [order, setOrder] = useState<OrderWithDetails | null>(initialOrder);

    useEffect(() => {
        const supabase = createClient();

        // Subscribe to changes on this specific order
        const channel = supabase
            .channel(`order-${orderId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "orders",
                    filter: `id=eq.${orderId}`,
                },
                async () => {
                    // Fetch the full order with relations
                    const { data } = await supabase
                        .from("orders")
                        .select(`
              *,
              item:items(*),
              partner:delivery_partners(*),
              drop_location:locations(*)
            `)
                        .eq("id", orderId)
                        .single();

                    if (data) {
                        setOrder(data as OrderWithDetails);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId]);

    // Update state when initialOrder changes
    useEffect(() => {
        setOrder(initialOrder);
    }, [initialOrder]);

    return order;
}
