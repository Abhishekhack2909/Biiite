"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle } from "lucide-react";
import type { Item } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface ItemCardProps {
    item: Item;
    onClick: (item: Item) => void;
}

const categoryColors: Record<string, string> = {
    Stationery: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Books: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Electronics: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    Sports: "bg-green-500/10 text-green-600 border-green-500/20",
    General: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    Clothing: "bg-pink-500/10 text-pink-600 border-pink-500/20",
};

const categoryIcons: Record<string, string> = {
    Stationery: "📝",
    Books: "📚",
    Electronics: "🔌",
    Sports: "⚽",
    General: "📦",
    Clothing: "👕",
};

export function ItemCard({ item, onClick }: ItemCardProps) {
    return (
        <Card
            className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                "border-border/50 bg-gradient-to-br from-card to-card/80",
                !item.available && "opacity-50 pointer-events-none"
            )}
            onClick={() => onClick(item)}
        >
            <CardContent className="p-4">
                {/* Category Icon & Badge */}
                <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl" role="img" aria-label={item.category}>
                        {categoryIcons[item.category] || "📦"}
                    </span>
                    <Badge
                        variant="outline"
                        className={cn("text-[10px] font-medium", categoryColors[item.category])}
                    >
                        {item.category}
                    </Badge>
                </div>

                {/* Item Name */}
                <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">
                    {item.name}
                </h3>

                {/* Item Details */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {/* Weight */}
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Package className="h-3 w-3" />
                        <span>{item.weight_kg}kg</span>
                    </div>

                    {/* Fragile Warning */}
                    {item.fragile && (
                        <div className="flex items-center gap-1 text-[10px] text-orange-500">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Fragile</span>
                        </div>
                    )}
                </div>

                {/* Availability */}
                {!item.available && (
                    <div className="mt-2 text-[10px] text-muted-foreground">
                        Currently unavailable
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
