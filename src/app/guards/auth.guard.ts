import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { SupabaseService } from "../services/supabase/supabase.service";

// Auth Guard to protect routes that require authentication
// If the user is not authenticated, they will be redirected to the login page
export const authGuard = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const user = await supabaseService.getUser();
  if (!user) {
    // Tell Angular Router to send the user to the login page
    return router.navigate(["/login"]).then(() => {
      // Return false to indicate that the route should not be activated
      return false;
    });
  }
  return true;
};
