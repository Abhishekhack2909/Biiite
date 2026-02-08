import { getItems, getLocations } from "@/lib/actions/data";
import { ItemsClient } from "./items-client";

export default async function HomePage() {
    const [items, locations] = await Promise.all([getItems(), getLocations()]);

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-xl font-bold">Available Items</h1>
                <p className="text-sm text-muted-foreground">
                    Request delivery for any item below
                </p>
            </div>
            <ItemsClient items={items} locations={locations} />
        </div>
    );
}
