import { redirect } from "next/navigation";

/**
 * Temporary backward compatibility redirect
 * Redirects old /auth/callback to new /api/auth/callback
 * 
 * This allows the site to work while Google OAuth settings are being updated
 * Can be removed once Google OAuth redirect URI is updated to /api/auth/callback
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const next = searchParams.get("next");
  
  // Build redirect URL with all params
  const params = new URLSearchParams();
  if (code) params.set("code", code);
  if (error) params.set("error", error);
  if (next) params.set("next", next);
  
  // Redirect to new API route location
  redirect(`/api/auth/callback?${params.toString()}`);
}
