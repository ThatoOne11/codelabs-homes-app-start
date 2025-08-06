import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { SupabaseService } from "../services/supabase/supabase.service";

export const authGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const user = await supabaseService.getUser();
  if (!user) {
    // Tell Angular Router to send the user to the login page
    return router.createUrlTree(["/login"], {
      queryParams: { returnUrl: state.url },
    });
  }
  return true;
};
