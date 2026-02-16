"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, CheckCircle2, XCircle } from "lucide-react";
import { usePartnerAvailability } from "@/hooks/use-partner-availability";
import type { DeliveryPartner, Location } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface PartnersClientProps {
    initialPartners: DeliveryPartner[];
    locations: Location[];
}

export function PartnersClient({ initialPartners, locations }: PartnersClientProps) {
    const partners = usePartnerAvailability(initialPartners);

    const getLocationName = (id: string | null) => {
        if (!id) return "Unknown";
        return locations.find((l) => l.id === id)?.name || "Unknown";
    };

    return (
        <div className="space-y-3">
            {partners.map((partner) => (
                <Card
                    key={partner.id}
                    className={cn(
                        "transition-all",
                        !partner.is_available && "opacity-60"
                    )}
                >
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className={cn(
                                        "w-2 h-2 rounded-full",
                                        partner.is_available ? "bg-emerald-500" : "bg-red-500"
                                    )}
                                />
                                <h3 className="font-semibold">{partner.name}</h3>
                            </div>
                            <Badge
                                variant="outline"
                                className={
                                    partner.is_available
                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                        : "bg-red-500/10 text-red-600 border-red-500/30"
                                }
                            >
                                {partner.is_available ? "Available" : "Busy"}
                            </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                            {/* Current Location */}
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{getLocationName(partner.current_location_id)}</span>
                            </div>

                            {/* Capacity */}
                            <div className="flex items-center gap-2">
                                <Package className="h-3.5 w-3.5" />
                                <span>Max {partner.max_weight_kg}kg capacity</span>
                            </div>

                            {/* Fragile Handling */}
                            <div className="flex items-center gap-2">
                                {partner.can_handle_fragile ? (
                                    <>
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                        <span className="text-emerald-600">Fragile-certified</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-3.5 w-3.5 text-amber-500" />
                                        <span className="text-amber-600">No fragile handling</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
