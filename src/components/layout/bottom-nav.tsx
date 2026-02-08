"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", icon: Home, label: "Items" },
    { href: "/orders", icon: Package, label: "Orders" },
    { href: "/partners", icon: Users, label: "Partners" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-xs font-medium transition-all",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-5 w-5 transition-transform",
                                    isActive && "scale-110"
                                )}
                            />
                            <span>{label}</span>
                            {isActive && (
                                <span className="absolute -bottom-0 h-0.5 w-8 rounded-full bg-primary" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
