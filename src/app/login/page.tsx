"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, signInWithGoogle } from "@/lib/actions/auth";
import { Loader2, Chrome, UserCheck } from "lucide-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Clear error when component mounts and check for error in URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlError = urlParams.get('error');
        
        if (urlError) {
            setError(urlError === 'session_error' 
                ? 'Failed to complete sign in. Please try again.' 
                : 'Authentication failed. Please try again.');
            // Remove error from URL
            window.history.replaceState({}, '', window.location.pathname);
        } else {
            setError(null);
        }
    }, []);

    const handleReviewerLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signIn('reviewer@campusdelivery.com', 'ReviewerDemo123!');
            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            }
            // Success - will redirect automatically
        } catch {
            setError("Failed to login as reviewer");
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
            // If we reach here without redirect, something went wrong
            setError("Failed to start Google sign in");
            setIsLoading(false);
        } catch (err) {
            // Only show error if it's not a redirect (Next.js throws NEXT_REDIRECT)
            if (err && typeof err === 'object' && 'digest' in err && 
                typeof err.digest === 'string' && err.digest.includes('NEXT_REDIRECT')) {
                // This is expected - redirect is happening
                return;
            }
            setError("Failed to start Google sign in");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-2">
                        <span className="text-lg font-bold text-white">CD</span>
                    </div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Campus Deliver
                    </CardTitle>
                    <CardDescription>
                        Request campus deliveries in seconds
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* 1-Click Reviewer Login */}
                    <Button
                        variant="default"
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        onClick={handleReviewerLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <UserCheck className="h-4 w-4 mr-2" />
                        )}
                        1-Click Reviewer Login
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>

                    {/* Google OAuth */}
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Chrome className="h-4 w-4 mr-2" />
                        )}
                        Continue with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
