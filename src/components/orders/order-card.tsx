"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Package, MapPin, Clock } from "lucide-react";
import type { OrderWithDetails, OrderStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface OrderCardProps {
    order: OrderWithDetails;
}

const statusColors: Record<OrderStatus, string> = {
    requested: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    picked_up: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function OrderCard({ order }: OrderCardProps) {
    const isActive = order.status !== "delivered" && order.status !== "cancelled";

    return (
        <Link href={`/orders/${order.id}`}>
            <Card
                className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                    isActive && "border-primary/30 bg-primary/5"
                )}
            >
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className={cn("text-xs", statusColors[order.status])}>
                            {order.status.replace("_", " ")}
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(order.created_at).toLocaleDateString()}
                        </div>
                    </div>

                    <h3 className="font-medium text-sm mb-2">
                        {order.item?.name || "Unknown Item"}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{order.drop_location?.name || "Unknown"}</span>
                        </div>
                        {order.partner && (
                            <div className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                <span>{order.partner.name}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
