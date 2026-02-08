"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, Package, Truck, MapPin, User } from "lucide-react";
import type { OrderWithDetails, OrderStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface OrderTrackerProps {
    order: OrderWithDetails;
}

const statusSteps: { status: OrderStatus; label: string; icon: typeof Circle }[] = [
    { status: "requested", label: "Requested", icon: Circle },
    { status: "assigned", label: "Assigned", icon: User },
    { status: "picked_up", label: "Picked Up", icon: Package },
    { status: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const statusColors: Record<OrderStatus, string> = {
    requested: "bg-slate-500",
    assigned: "bg-blue-500",
    picked_up: "bg-amber-500",
    delivered: "bg-emerald-500",
    cancelled: "bg-red-500",
};

function getStepIndex(status: OrderStatus): number {
    if (status === "cancelled") return -1;
    return statusSteps.findIndex((s) => s.status === status);
}

export function OrderTracker({ order }: OrderTrackerProps) {
    const currentStepIndex = getStepIndex(order.status);

    if (order.status === "cancelled") {
        return (
            <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-4">
                <Badge variant="destructive" className="mb-2">
                    Cancelled
                </Badge>
                <p className="text-sm text-muted-foreground">
                    This order has been cancelled.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
                <Badge className={cn("capitalize", statusColors[order.status])}>
                    {order.status.replace("_", " ")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                    Updated {new Date(order.updated_at).toLocaleTimeString()}
                </span>
            </div>

            {/* Progress Stepper */}
            <div className="relative">
                <div className="flex items-center justify-between">
                    {statusSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const Icon = step.icon;

                        return (
                            <div key={step.status} className="flex flex-col items-center flex-1">
                                <div
                                    className={cn(
                                        "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                                        isCompleted
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-muted-foreground/30 bg-background text-muted-foreground",
                                        isCurrent && "ring-4 ring-primary/20"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span
                                    className={cn(
                                        "mt-2 text-[10px] font-medium text-center",
                                        isCompleted ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Line */}
                <div className="absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-muted-foreground/20 -z-0">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{
                            width: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%`,
                        }}
                    />
                </div>
            </div>

            <Separator className="my-4" />

            {/* Order Details */}
            <div className="space-y-3">
                {/* Item */}
                {order.item && (
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                            <Package className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Item</p>
                            <p className="text-sm font-medium">{order.item.name}</p>
                        </div>
                    </div>
                )}

                {/* Partner */}
                {order.partner && (
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                            <Truck className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Delivery Partner</p>
                            <p className="text-sm font-medium">{order.partner.name}</p>
                        </div>
                    </div>
                )}

                {/* Drop Location */}
                {order.drop_location && (
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                            <MapPin className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Delivery To</p>
                            <p className="text-sm font-medium">{order.drop_location.name}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
