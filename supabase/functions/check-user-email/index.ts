import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const gotrueApiUrl = `${supabaseUrl}/auth/v1`;

// List of allowed origins for CORS
const allowedOrigins = new Set([
  "http://localhost:4200",
  "https://angular-homes-app-8fi.pages.dev",
]);

function getCorsHeaders(origin: string | null) {
  const allowOrigin = origin && allowedOrigins.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    // Handle CORS preflight request
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { email } = await req.json() as { email?: unknown };

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid or missing email" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query GoTrue Admin API securely with service role key
    const goTrueRes = await fetch(
      `${gotrueApiUrl}/admin/users?email=${
        encodeURIComponent(normalizedEmail)
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
          apikey: supabaseServiceRoleKey,
        },
      },
    );

    if (!goTrueRes.ok) {
      const errData = await goTrueRes.json().catch(() => ({}));
      console.error("GoTrue API error:", errData);

      // Return exists: false if user not found (404) for graceful handling
      if (goTrueRes.status === 404) {
        return new Response(
          JSON.stringify({ exists: false }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({ error: errData.msg || "Failed to query user" }),
        {
          status: goTrueRes.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await goTrueRes.json();
    console.log("GoTrue Admin API response:", JSON.stringify(data, null, 2));

    // Confirm email existence by exact case-insensitive match
    const exists = Array.isArray(data.users) && data.users.some(
      (user: { email?: string }) =>
        user.email?.toLowerCase() === normalizedEmail,
    );

    return new Response(
      JSON.stringify({ exists }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Unhandled function error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
