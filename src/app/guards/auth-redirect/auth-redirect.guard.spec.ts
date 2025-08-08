import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { SupabaseService } from "../../services/supabase/supabase.service";
import { authRedirectGuard } from "./auth-redirect.guard"; // adjust path if needed
import type { User } from "@supabase/supabase-js";
import { EnvironmentInjector, runInInjectionContext } from "@angular/core";

describe("authRedirectGuard", () => {
  let supabaseServiceSpy: jasmine.SpyObj<SupabaseService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let envInjector: EnvironmentInjector;

  const mockUser: User = {
    id: "123",
    email: "test@example.com",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    const supabaseSpy = jasmine.createSpyObj("SupabaseService", ["getUser"]);
    const rSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        { provide: SupabaseService, useValue: supabaseSpy },
        { provide: Router, useValue: rSpy },
      ],
    });

    supabaseServiceSpy = TestBed.inject(
      SupabaseService,
    ) as jasmine.SpyObj<SupabaseService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    envInjector = TestBed.inject(EnvironmentInjector);
  });

  it("should redirect to /home and return false if user is authenticated", async () => {
    supabaseServiceSpy.getUser.and.returnValue(Promise.resolve(mockUser));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    const result = await runInInjectionContext(
      envInjector,
      () => authRedirectGuard(),
    );

    expect(routerSpy.navigate).toHaveBeenCalledWith(["/home"]);
    expect(result).toBeFalse();
  });

  it("should allow activation (return true) if user is NOT authenticated", async () => {
    supabaseServiceSpy.getUser.and.returnValue(Promise.resolve(null));

    const result = await runInInjectionContext(
      envInjector,
      () => authRedirectGuard(),
    );

    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(result).toBeTrue();
  });
});
