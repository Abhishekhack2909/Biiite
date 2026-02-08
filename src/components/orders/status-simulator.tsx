"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { OrderStatus } from "@/lib/supabase/types";

interface StatusSimulatorProps {
    orderId: string;
    currentStatus: OrderStatus;
}

const statusFlow: OrderStatus[] = ["assigned", "picked_up", "delivered"];

export function StatusSimulator({ orderId, currentStatus }: StatusSimulatorProps) {
    const [loadingStatus, setLoadingStatus] = useState<OrderStatus | null>(null);

    const handleSimulate = async (status: OrderStatus) => {
        setLoadingStatus(status);
        await updateOrderStatus(orderId, status);
        setLoadingStatus(null);
    };

    if (currentStatus === "delivered" || currentStatus === "cancelled") {
        return null;
    }

    const currentIndex = statusFlow.indexOf(currentStatus);

    return (
        <Card className="border-dashed border-amber-500/50 bg-amber-500/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <span className="text-amber-600">🧪</span>
                    Debug / Simulate Status
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                    Use these buttons to simulate delivery progress for demo purposes.
                </p>

                <div className="flex flex-wrap gap-2">
                    {statusFlow.map((status, index) => {
                        const isCompleted = index <= currentIndex;
                        const isNext = index === currentIndex + 1;
                        const isDisabled = index <= currentIndex || (index > currentIndex + 1);

                        return (
                            <Button
                                key={status}
                                size="sm"
                                variant={isCompleted ? "secondary" : isNext ? "default" : "outline"}
                                disabled={isDisabled || loadingStatus !== null}
                                onClick={() => handleSimulate(status)}
                                className="text-xs"
                            >
                                {loadingStatus === status ? (
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : isCompleted ? (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                    <Play className="h-3 w-3 mr-1" />
                                )}
                                {status === "picked_up" ? "Simulate Pickup" : `Simulate ${status}`}
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
