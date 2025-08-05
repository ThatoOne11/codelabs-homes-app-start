import { createClient } from "@supabase/supabase-js";
import { environment } from "./../src/environments/environment";

export const supabase = createClient(
    environment.supabaseAPIUrl,
    environment.supabaseKey,
);
