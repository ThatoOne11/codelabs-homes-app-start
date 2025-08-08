import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const gotrueApiUrl = `${supabaseUrl}/auth/v1`;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:4200", // my local dev frontend URL
  "https://angular-homes-app-8fi.pages.dev", // my deployed frontend URL
];

function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin ?? "")
      ? origin ?? ""
      : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    // Respond to preflight requests
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    const { email } = await req.json() as { email?: string };
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid or missing email" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Query GoTrue Admin API directly with email filter
    const response = await fetch(
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

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("GoTrue error:", errData);
      return new Response(
        JSON.stringify({ error: errData.msg || "Failed to query user" }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();
    console.log("GoTrue Admin API response:", JSON.stringify(data, null, 2));

    const users = data.users ?? [];

    // Exact email match check
    const exists = users.some(
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
  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
