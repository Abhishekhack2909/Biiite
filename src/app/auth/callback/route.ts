import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";
    const error = searchParams.get("error");

    // If there's an error from the OAuth provider, redirect to login with error
    if (error) {
        return NextResponse.redirect(`${origin}/login?error=${error}`);
    }

    if (code) {
        const supabase = await createClient();
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (!exchangeError) {
            // Successful authentication, redirect to home
            return NextResponse.redirect(`${origin}${next}`);
        }

        // Error exchanging code for session
        return NextResponse.redirect(`${origin}/login?error=session_error`);
    }

    // No code provided, redirect to login
    return NextResponse.redirect(`${origin}/login`);
}
