"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
    user: User | null;
}

export function Header({ user }: HeaderProps) {
    const handleSignOut = async () => {
        await signOut();
    };

    const initials = user?.email?.slice(0, 2).toUpperCase() || "??";

    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
                        <span className="text-sm font-bold text-white">CD</span>
                    </div>
                    <span className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Campus Deliver
                    </span>
                </div>

                {user && (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-cyan-500 text-white text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSignOut}
                            className="h-8 w-8 text-muted-foreground"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
