"use server";

import { createClient } from "@/lib/supabase/server";
import type { DeliveryPartner, Item } from "@/lib/supabase/types";

interface AssignmentResult {
    success: boolean;
    partnerId: string | null;
    partnerName: string | null;
    reason: string;
}

/**
 * Auto-Assign Partner Algorithm
 *
 * Rules (in order of priority):
 * 1. Availability: Partner must have is_available = true
 * 2. Weight Capacity: Partner's max_weight_kg >= Item's weight_kg
 * 3. Fragility Check: If item is fragile, partner must have can_handle_fragile = true
 * 4. Optimization: Prefer partner at same location as item pickup
 */
export async function assignPartner(itemId: string): Promise<AssignmentResult> {
    const supabase = await createClient();

    // Fetch item details
    const { data: item, error: itemError } = await supabase
        .from("items")
        .select("*")
        .eq("id", itemId)
        .single();

    if (itemError || !item) {
        return {
            success: false,
            partnerId: null,
            partnerName: null,
            reason: `Item not found: ${itemId}`,
        };
    }

    // Build query for eligible partners
    let query = supabase
        .from("delivery_partners")
        .select("*")
        .eq("is_available", true)
        .gte("max_weight_kg", item.weight_kg);

    // Add fragile constraint if item is fragile
    if (item.fragile) {
        query = query.eq("can_handle_fragile", true);
    }

    const { data: eligiblePartners, error: partnerError } = await query;

    if (partnerError) {
        return {
            success: false,
            partnerId: null,
            partnerName: null,
            reason: `Database error: ${partnerError.message}`,
        };
    }

    if (!eligiblePartners || eligiblePartners.length === 0) {
        return {
            success: false,
            partnerId: null,
            partnerName: null,
            reason: buildNoPartnerReason(item),
        };
    }

    // Sort by proximity (partner at pickup location first)
    const sortedPartners = eligiblePartners.sort((a: DeliveryPartner, b: DeliveryPartner) => {
        const aAtPickup = a.current_location_id === item.pickup_location_id ? 1 : 0;
        const bAtPickup = b.current_location_id === item.pickup_location_id ? 1 : 0;
        return bAtPickup - aAtPickup; // Higher score first
    });

    const selectedPartner = sortedPartners[0];

    return {
        success: true,
        partnerId: selectedPartner.id,
        partnerName: selectedPartner.name,
        reason: `Assigned to ${selectedPartner.name} (Capacity: ${selectedPartner.max_weight_kg}kg, Fragile-certified: ${selectedPartner.can_handle_fragile ? "Yes" : "No"})`,
    };
}

/**
 * Build a helpful error message when no partner is available
 */
function buildNoPartnerReason(item: Item): string {
    const reasons: string[] = [];

    if (item.fragile) {
        reasons.push("requires fragile handling");
    }
    if (item.weight_kg > 2.5) {
        reasons.push(`weight (${item.weight_kg}kg) exceeds many partners' capacity`);
    }

    if (reasons.length > 0) {
        return `No available partner for ${item.name}: ${reasons.join(", ")}. Please try again later.`;
    }

    return `No available partner for ${item.name}. All partners are currently busy.`;
}

/**
 * Get all eligible partners for an item (for debugging/display)
 */
export async function getEligiblePartners(itemId: string): Promise<DeliveryPartner[]> {
    const supabase = await createClient();

    const { data: item } = await supabase
        .from("items")
        .select("*")
        .eq("id", itemId)
        .single();

    if (!item) return [];

    let query = supabase
        .from("delivery_partners")
        .select("*")
        .eq("is_available", true)
        .gte("max_weight_kg", item.weight_kg);

    if (item.fragile) {
        query = query.eq("can_handle_fragile", true);
    }

    const { data } = await query;
    return data || [];
}
