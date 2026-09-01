import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectedFrom") ?? "/dashboard";

  // Always redirect to the public app URL, never to whatever internal
  // host/port the request happens to show behind Railway's proxy.
  const publicOrigin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${publicOrigin}${redirectTo}`);
    }
  }

  // Something went wrong — send the user back to login with an error flag
  return NextResponse.redirect(`${publicOrigin}/login?error=auth_callback_failed`);
}
