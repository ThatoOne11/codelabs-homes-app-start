import { inject, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { SupabaseService } from "../../services/supabase/supabase.service";
import { authGuard } from "./auth.guard";
import type { User } from "@supabase/supabase-js";
import { EnvironmentInjector, runInInjectionContext } from "@angular/core";

describe("authGuard", () => {
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

  it("should allow activation if user is authenticated", async () => {
    supabaseServiceSpy.getUser.and.returnValue(Promise.resolve(mockUser));

    const result = await runInInjectionContext(envInjector, () => authGuard());

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it("should redirect to login and return false if user is not authenticated", async () => {
    supabaseServiceSpy.getUser.and.returnValue(Promise.resolve(null));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    const result = await runInInjectionContext(envInjector, () => authGuard());

    expect(routerSpy.navigate).toHaveBeenCalledWith(["/login"]);
    expect(result).toBeFalse();
  });
});
