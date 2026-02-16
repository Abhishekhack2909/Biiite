import { getUserOrders } from "@/lib/actions/orders";
import { OrderCard } from "@/components/orders/order-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";
import { ProtectedLayout } from "@/components/layout/protected-layout";

export default async function OrdersPage() {
    const orders = await getUserOrders();

    const activeOrders = orders.filter(
        (o) => o.status !== "delivered" && o.status !== "cancelled"
    );
    const pastOrders = orders.filter(
        (o) => o.status === "delivered" || o.status === "cancelled"
    );

    return (
        <ProtectedLayout>
            <div>
                <div className="mb-4">
                    <h1 className="text-xl font-bold">Your Orders</h1>
                    <p className="text-sm text-muted-foreground">
                        Track and manage your deliveries
                    </p>
                </div>

                {orders.length === 0 ? (
                <div className="text-center py-16">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No orders yet</p>
                    <p className="text-xs text-muted-foreground">
                        Request a delivery from the Items tab
                    </p>
                </div>
            ) : (
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="active">
                            Active ({activeOrders.length})
                        </TabsTrigger>
                        <TabsTrigger value="past">
                            Past ({pastOrders.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="space-y-3">
                        {activeOrders.length === 0 ? (
                            <p className="text-center py-8 text-sm text-muted-foreground">
                                No active orders
                            </p>
                        ) : (
                            activeOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-3">
                        {pastOrders.length === 0 ? (
                            <p className="text-center py-8 text-sm text-muted-foreground">
                                No past orders
                            </p>
                        ) : (
                            pastOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))
                        )}
                    </TabsContent>
                </Tabs>
                )}
            </div>
        </ProtectedLayout>
    );
}
