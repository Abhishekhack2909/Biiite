"use server";

import { createClient } from "@/lib/supabase/server";
import { assignPartner } from "./assign-partner";
import type { Order, OrderWithDetails, OrderStatus } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

interface CreateOrderResult {
    success: boolean;
    order: Order | null;
    error: string | null;
    assignmentReason: string;
}

/**
 * Create a new order with automatic partner assignment
 */
export async function createOrder(
    itemId: string,
    dropLocationId: string
): Promise<CreateOrderResult> {
    const supabase = await createClient();

    // Get current user
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            success: false,
            order: null,
            error: "You must be logged in to create an order",
            assignmentReason: "",
        };
    }

    // Assign partner using the algorithm
    const assignment = await assignPartner(itemId);

    if (!assignment.success || !assignment.partnerId) {
        return {
            success: false,
            order: null,
            error: assignment.reason,
            assignmentReason: assignment.reason,
        };
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: user.id,
            item_id: itemId,
            partner_id: assignment.partnerId,
            drop_location_id: dropLocationId,
            status: "assigned",
        })
        .select()
        .single();

    if (orderError) {
        return {
            success: false,
            order: null,
            error: `Failed to create order: ${orderError.message}`,
            assignmentReason: assignment.reason,
        };
    }

    revalidatePath("/orders");

    return {
        success: true,
        order,
        error: null,
        assignmentReason: assignment.reason,
    };
}

/**
 * Update order status (for simulation/demo purposes)
 */
export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus
): Promise<{ success: boolean; error: string | null }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("orders")
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

    return { success: true, error: null };
}

/**
 * Get all orders for the current user
 */
export async function getUserOrders(): Promise<OrderWithDetails[]> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from("orders")
        .select(
            `
      *,
      item:items(*),
      partner:delivery_partners(*),
      drop_location:locations(*)
    `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return data || [];
}

/**
 * Get a single order by ID
 */
/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<OrderWithDetails | null> {
    // Validate UUID format to prevent database errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
        return null;
    }

    const supabase = await createClient();

    const { data } = await supabase
        .from("orders")
        .select(
            `
      *,
      item:items(*),
      partner:delivery_partners(*),
      drop_location:locations(*)
    `
        )
        .eq("id", orderId)
        .single();

    return data || null;
}
