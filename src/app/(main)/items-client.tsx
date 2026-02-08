"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemCard } from "@/components/items/item-card";
import { RequestModal } from "@/components/items/request-modal";
import { Search } from "lucide-react";
import type { Item, Location } from "@/lib/supabase/types";

interface ItemsClientProps {
    items: Item[];
    locations: Location[];
}

export function ItemsClient({ items, locations }: ItemsClientProps) {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Get unique categories
    const categories = ["All", ...new Set(items.map((item) => item.category))];

    // Filter items
    const filteredItems = items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    return (
        <>
            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Category Tabs */}
            <div className="mb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                    <TabsList className="h-9 bg-muted/50">
                        {categories.map((cat) => (
                            <TabsTrigger
                                key={cat}
                                value={cat}
                                className="text-xs px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                {cat}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 gap-3">
                {filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} onClick={handleItemClick} />
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                    No items found
                </div>
            )}

            {/* Request Modal */}
            <RequestModal
                item={selectedItem}
                locations={locations}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </>
    );
}
