"use server";

import { createClient } from "@/lib/supabase/server";
import type { Item, Location, DeliveryPartner } from "@/lib/supabase/types";

/**
 * Get all available items
 */
export async function getItems(): Promise<Item[]> {
    const supabase = await createClient();

    const { data } = await supabase
        .from("items")
        .select("*")
        .eq("available", true)
        .order("category");

    return data || [];
}

/**
 * Get a single item by ID
 */
export async function getItemById(itemId: string): Promise<Item | null> {
    const supabase = await createClient();

    const { data } = await supabase.from("items").select("*").eq("id", itemId).single();

    return data || null;
}

/**
 * Get all locations
 */
export async function getLocations(): Promise<Location[]> {
    const supabase = await createClient();

    const { data } = await supabase.from("locations").select("*").order("type");

    return data || [];
}

/**
 * Get drop-off locations (all except pickup location)
 */
export async function getDropLocations(excludeId?: string): Promise<Location[]> {
    const supabase = await createClient();

    let query = supabase.from("locations").select("*").order("type");

    if (excludeId) {
        query = query.neq("id", excludeId);
    }

    const { data } = await query;
    return data || [];
}

/**
 * Get all delivery partners
 */
export async function getDeliveryPartners(): Promise<DeliveryPartner[]> {
    const supabase = await createClient();

    const { data } = await supabase.from("delivery_partners").select("*").order("name");

    return data || [];
}
