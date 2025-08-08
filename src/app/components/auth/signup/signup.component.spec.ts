import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { SignupComponent } from "./signup.component";
import { SupabaseService } from "src/app/services/supabase/supabase.service";
import { AuthError } from "@supabase/auth-js";

// Mock AuthError to bypass protected properties issue
class MockAuthError extends AuthError {
  constructor(message: string) {
    super(message);
  }
}

describe("SignupComponent", () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let supabaseServiceSpy: jasmine.SpyObj<SupabaseService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const supabaseSpy = jasmine.createSpyObj("SupabaseService", [
      "signUpWithEmail",
    ]);
    const routerMock = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        { provide: SupabaseService, useValue: supabaseSpy },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    supabaseServiceSpy = TestBed.inject(SupabaseService) as jasmine.SpyObj<
      SupabaseService
    >;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it(
    "should set success message and navigate on successful signup",
    fakeAsync(() => {
      supabaseServiceSpy.signUpWithEmail.and.returnValue(
        Promise.resolve({
          data: { user: null, session: null }, // you can fill with more realistic user/session if needed
          error: null,
        }),
      );

      component.name = "Test User";
      component.email = "test@example.com";
      component.password = "password";

      component.signUp();

      tick(); // flush async promise

      expect(component.message()).toBe(
        "Registration successful! Check your email to confirm.",
      );
      expect(component.messageType()).toBe("success");

      tick(2000); // flush navigation delay

      expect(routerSpy.navigate).toHaveBeenCalledWith(["/home"]);

      tick(5000); // flush message clear timeout
    }),
  );

  it(
    "should set error message on signup failure",
    fakeAsync(() => {
      const mockError = new MockAuthError("Email already registered");

      supabaseServiceSpy.signUpWithEmail.and.returnValue(
        Promise.resolve({
          data: { user: null, session: null },
          error: mockError,
        }),
      );

      component.name = "Test User";
      component.email = "test@example.com";
      component.password = "password";

      component.signUp();

      tick(); // flush async promise

      expect(component.message()).toBe("Error: Email already registered");
      expect(component.messageType()).toBe("error");

      tick(5000); // flush message clear timeout
    }),
  );

  it("should navigate to login page", () => {
    component.navigateToLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/login"]);
  });
});
