"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, MapPin, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { createOrder } from "@/lib/actions/orders";
import type { Item, Location } from "@/lib/supabase/types";
import { useRouter } from "next/navigation";

interface RequestModalProps {
    item: Item | null;
    locations: Location[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RequestModal({ item, locations, open, onOpenChange }: RequestModalProps) {
    const router = useRouter();
    const [dropLocationId, setDropLocationId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        orderId?: string;
    } | null>(null);

    // Filter out the pickup location from drop options
    const dropLocations = locations.filter((loc) => loc.id !== item?.pickup_location_id);

    const handleSubmit = async () => {
        if (!item || !dropLocationId) return;

        setIsLoading(true);
        setResult(null);

        try {
            const response = await createOrder(item.id, dropLocationId);

            if (response.success && response.order) {
                setResult({
                    success: true,
                    message: response.assignmentReason,
                    orderId: response.order.id,
                });
            } else {
                setResult({
                    success: false,
                    message: response.error || "Failed to create order",
                });
            }
        } catch {
            setResult({
                success: false,
                message: "An unexpected error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setDropLocationId("");
        setResult(null);
        onOpenChange(false);
    };

    const handleViewOrder = () => {
        if (result?.orderId) {
            router.push(`/orders/${result.orderId}`);
            handleClose();
        }
    };

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg">Request Delivery</DialogTitle>
                    <DialogDescription>
                        Select where you want this item delivered
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Item Summary */}
                    <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="text-xs">
                                <Package className="h-3 w-3 mr-1" />
                                {item.weight_kg}kg
                            </Badge>
                            {item.fragile && (
                                <Badge variant="outline" className="text-xs text-orange-500 border-orange-500/30">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Fragile
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Location Selection */}
                    {!result && (
                        <div className="space-y-2">
                            <Label htmlFor="drop-location">Drop Location</Label>
                            <Select value={dropLocationId} onValueChange={setDropLocationId}>
                                <SelectTrigger id="drop-location">
                                    <SelectValue placeholder="Select delivery location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dropLocations.map((location) => (
                                        <SelectItem key={location.id} value={location.id}>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                                <span>{location.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({location.type})
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Result Display */}
                    {result && (
                        <div
                            className={`rounded-lg border p-4 ${result.success
                                ? "bg-emerald-500/10 border-emerald-500/30"
                                : "bg-red-500/10 border-red-500/30"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {result.success ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                )}
                                <div className="space-y-1">
                                    <p className="font-medium text-sm">
                                        {result.success ? "Order Created!" : "Assignment Failed"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {result.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        {result?.success ? (
                            <>
                                <Button variant="outline" onClick={handleClose} className="flex-1">
                                    Close
                                </Button>
                                <Button onClick={handleViewOrder} className="flex-1">
                                    View Order
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={handleClose} className="flex-1">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!dropLocationId || isLoading}
                                    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Assigning...
                                        </>
                                    ) : (
                                        "Request Delivery"
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
