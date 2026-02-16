import { getDeliveryPartners, getLocations } from "@/lib/actions/data";
import { PartnersClient } from "./partners-client";
import { ProtectedLayout } from "@/components/layout/protected-layout";

export default async function PartnersPage() {
    const [partners, locations] = await Promise.all([
        getDeliveryPartners(),
        getLocations(),
    ]);

    return (
        <ProtectedLayout>
            <div>
                <div className="mb-4">
                    <h1 className="text-xl font-bold">Delivery Partners</h1>
                    <p className="text-sm text-muted-foreground">
                        View partner status and capabilities
                    </p>
                </div>

                <PartnersClient initialPartners={partners} locations={locations} />
            </div>
        </ProtectedLayout>
    );
}
