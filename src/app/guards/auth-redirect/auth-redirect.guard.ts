// src/app/guards/auth-redirect.guard.ts
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { SupabaseService } from "../../services/supabase/supabase.service";

// Guard to redirect logged-in users AWAY from login/signup
export const authRedirectGuard = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const user = await supabaseService.getUser();

  if (user) {
    // User is already logged in, redirect them to /home
    return router.navigate(["/home"]).then(() => false);
  }

  return true; // Allow access to login/signup
};
