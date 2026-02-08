"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DeliveryPartner } from "@/lib/supabase/types";

export function usePartnerAvailability(initialPartners: DeliveryPartner[]) {
    const [partners, setPartners] = useState<DeliveryPartner[]>(initialPartners);

    useEffect(() => {
        const supabase = createClient();

        const channel = supabase
            .channel("partners-availability")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "delivery_partners",
                },
                async () => {
                    // Refetch all partners when any change happens
                    const { data } = await supabase
                        .from("delivery_partners")
                        .select("*")
                        .order("name");

                    if (data) {
                        setPartners(data);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Update when initialPartners change
    useEffect(() => {
        setPartners(initialPartners);
    }, [initialPartners]);

    return partners;
}
