import { getOrderById } from "@/lib/actions/orders";
import { notFound } from "next/navigation";
import { OrderDetailClient } from "./order-detail-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProtectedLayout } from "@/components/layout/protected-layout";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    return (
        <ProtectedLayout>
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <Link href="/orders">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold">Order Details</h1>
                        <p className="text-xs text-muted-foreground">
                            #{order.id.slice(0, 8)}
                        </p>
                    </div>
                </div>

                <OrderDetailClient initialOrder={order} />
            </div>
        </ProtectedLayout>
    );
}
