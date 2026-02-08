import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { getCurrentUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header user={user} />
            <main className="flex-1 pb-20 mx-auto w-full max-w-md px-4 py-4">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
