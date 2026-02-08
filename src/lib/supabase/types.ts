export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            locations: {
                Row: {
                    id: string;
                    name: string;
                    type: string;
                };
                Insert: {
                    id: string;
                    name: string;
                    type: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    type?: string;
                };
            };
            items: {
                Row: {
                    id: string;
                    name: string;
                    category: string;
                    pickup_location_id: string | null;
                    weight_kg: number;
                    fragile: boolean;
                    available: boolean;
                };
                Insert: {
                    id: string;
                    name: string;
                    category: string;
                    pickup_location_id?: string | null;
                    weight_kg: number;
                    fragile?: boolean;
                    available?: boolean;
                };
                Update: {
                    id?: string;
                    name?: string;
                    category?: string;
                    pickup_location_id?: string | null;
                    weight_kg?: number;
                    fragile?: boolean;
                    available?: boolean;
                };
            };
            delivery_partners: {
                Row: {
                    id: string;
                    name: string;
                    current_location_id: string | null;
                    max_weight_kg: number;
                    can_handle_fragile: boolean;
                    is_available: boolean;
                };
                Insert: {
                    id: string;
                    name: string;
                    current_location_id?: string | null;
                    max_weight_kg: number;
                    can_handle_fragile?: boolean;
                    is_available?: boolean;
                };
                Update: {
                    id?: string;
                    name?: string;
                    current_location_id?: string | null;
                    max_weight_kg?: number;
                    can_handle_fragile?: boolean;
                    is_available?: boolean;
                };
            };
            orders: {
                Row: {
                    id: string;
                    user_id: string | null;
                    item_id: string | null;
                    partner_id: string | null;
                    drop_location_id: string | null;
                    status: "requested" | "assigned" | "picked_up" | "delivered" | "cancelled";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id?: string | null;
                    item_id?: string | null;
                    partner_id?: string | null;
                    drop_location_id?: string | null;
                    status?: "requested" | "assigned" | "picked_up" | "delivered" | "cancelled";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string | null;
                    item_id?: string | null;
                    partner_id?: string | null;
                    drop_location_id?: string | null;
                    status?: "requested" | "assigned" | "picked_up" | "delivered" | "cancelled";
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}

// Helper types for easier usage
export type Location = Database["public"]["Tables"]["locations"]["Row"];
export type Item = Database["public"]["Tables"]["items"]["Row"];
export type DeliveryPartner = Database["public"]["Tables"]["delivery_partners"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderStatus = Order["status"];

// Extended types with relations
export interface OrderWithDetails extends Order {
    item: Item | null;
    partner: DeliveryPartner | null;
    drop_location: Location | null;
}
