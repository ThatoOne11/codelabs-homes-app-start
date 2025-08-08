import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { AuthError } from "@supabase/auth-js";
import type { Session } from "@supabase/auth-js";
import { LoginComponent } from "./login.component";
import { SupabaseService } from "src/app/services/supabase/supabase.service";

// Mock class extending AuthError to bypass protected member error
class MockAuthError extends AuthError {
  constructor(message: string) {
    super(message);
  }
}

const mockSession = {
  access_token: "fake_access_token",
  token_type: "bearer",
  expires_in: 3600,
  refresh_token: "fake_refresh_token",
  user: {
    id: "123",
    email: "test@example.com",
    user_metadata: {},
    app_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  },
  // ...add other required Session fields if needed or use a Partial type assertion
} as unknown as Session;

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let supabaseServiceSpy: jasmine.SpyObj<SupabaseService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const supabaseSpy = jasmine.createSpyObj("SupabaseService", [
      "signInWithEmail",
    ]);
    const routerMock = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: SupabaseService, useValue: supabaseSpy },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    supabaseServiceSpy = TestBed.inject(SupabaseService) as jasmine.SpyObj<
      SupabaseService
    >;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it(
    "should set success message and navigate on successful sign-in",
    fakeAsync(() => {
      supabaseServiceSpy.signInWithEmail.and.returnValue(
        Promise.resolve({
          data: {
            user: {
              id: "123",
              email: "test@example.com",
              user_metadata: {},
              app_metadata: {}, // Add this
              aud: "authenticated", // Add this (string)
              created_at: new Date().toISOString(), // Add this (ISO string)
            },
            session: mockSession,
          },
          error: null,
        }),
      );

      component.email = "test@example.com";
      component.password = "password";

      component.signInWithEmail();

      tick(); // flush async promise

      expect(component.message()).toBe("Signed in successfully!");
      expect(component.messageType()).toBe("success");

      tick(1500); // flush navigation delay

      expect(routerSpy.navigate).toHaveBeenCalledWith(["/home"]);

      tick(5000); // flush message clear timeout
    }),
  );

  it(
    "should set error message on sign-in failure",
    fakeAsync(() => {
      const mockError = new MockAuthError("Invalid credentials");

      supabaseServiceSpy.signInWithEmail.and.returnValue(
        Promise.resolve({
          data: { user: null, session: null },
          error: mockError,
        }),
      );

      component.email = "bad@example.com";
      component.password = "badpass";

      component.signInWithEmail();

      tick(); // flush async promise

      expect(component.message()).toBe("Error: Invalid credentials");
      expect(component.messageType()).toBe("error");

      tick(5000); // flush message clear timeout
    }),
  );
});
