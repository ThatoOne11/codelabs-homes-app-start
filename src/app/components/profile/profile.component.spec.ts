import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { ProfileComponent } from "./profile.component";
import { SupabaseService } from "src/app/services/supabase/supabase.service";
import { Router } from "@angular/router";
import type { AuthError, User as SupabaseUser } from "@supabase/auth-js";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("ProfileComponent", () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let supabaseServiceSpy: jasmine.SpyObj<SupabaseService>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Use Supabase SDK User type with required fields
  const mockUser: SupabaseUser = {
    id: "123",
    email: "test@example.com",
    app_metadata: {},
    aud: "authenticated",
    created_at: "2025-08-08T00:00:00Z",
    user_metadata: { displayName: "Test User" },
    phone: undefined,
  };

  beforeEach(async () => {
    const supabaseSpy = jasmine.createSpyObj("SupabaseService", [
      "getUser",
      "signOut",
    ]);
    const routerSpyObj = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent], // standalone component
      providers: [
        { provide: SupabaseService, useValue: supabaseSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    supabaseServiceSpy = TestBed.inject(
      SupabaseService,
    ) as jasmine.SpyObj<SupabaseService>;

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it(
    "should load user on init",
    fakeAsync(() => {
      supabaseServiceSpy.getUser.and.returnValue(Promise.resolve(mockUser));

      fixture.detectChanges(); // triggers ngOnInit
      tick();

      expect(supabaseServiceSpy.getUser).toHaveBeenCalled();
      expect(component.user).toEqual(mockUser);
    }),
  );

  it(
    "should alert and keep user null if not logged in",
    fakeAsync(() => {
      spyOn(window, "alert");
      supabaseServiceSpy.getUser.and.returnValue(Promise.resolve(null));

      fixture.detectChanges();
      tick();

      expect(component.user).toBeNull();
      expect(window.alert).toHaveBeenCalledWith(
        "You are not logged in. Redirecting to login page.",
      );
    }),
  );

  it(
    "should sign out and navigate to login",
    fakeAsync(() => {
      const mockSignOutResponse: { error: AuthError | null } = { error: null };
      supabaseServiceSpy.signOut.and.returnValue(
        Promise.resolve(mockSignOutResponse),
      );
      routerSpy.navigate.and.returnValue(Promise.resolve(true));

      component.signOut();
      tick();

      expect(supabaseServiceSpy.signOut).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(["/login"]);
    }),
  );
});
