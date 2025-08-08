import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SupabaseService } from "src/app/services/supabase/supabase.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent {
  name = "";
  email = "";
  password = "";

  message = signal<string | null>(null);
  messageType = signal<"success" | "error" | null>(null);
  isLoading = signal(false);
  isPasswordVisible = signal(false); // <-- Add this

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  togglePasswordVisibility() {
    this.isPasswordVisible.update((v) => !v);
  }

  async signUp() {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    this.message.set(null);
    this.messageType.set(null);

    try {
      const { data, error } = await this.supabaseService.signUpWithEmail({
        name: this.name,
        email: this.email,
        password: this.password,
      });

      if (error) {
        if (
          error.message.includes("User already registered") ||
          error.message.includes("users with this email address already exists")
        ) {
          this.message.set(
            "This email is already registered. Please log in or use a different email.",
          );
          this.messageType.set("error");
        } else {
          this.message.set("Registration failed: " + error.message);
          this.messageType.set("error");
        }
      } else {
        this.message.set(
          "Registration successful! Check your email to confirm your account.",
        );
        this.messageType.set("success");
        setTimeout(() => this.router.navigate(["/home"]), 1500);
      }
    } catch (err) {
      this.message.set(
        "An unexpected error occurred: " + (err as Error).message,
      );
      this.messageType.set("error");
    } finally {
      this.isLoading.set(false);
      setTimeout(() => {
        this.message.set(null);
        this.messageType.set(null);
      }, 5000);
    }
  }

  navigateToLogin() {
    this.router.navigate(["/login"]);
  }
}
