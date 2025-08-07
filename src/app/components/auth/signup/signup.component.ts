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

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  async signUp() {
    const { error } = await this.supabaseService.signUpWithEmail({
      name: this.name,
      email: this.email,
      password: this.password,
    });

    if (error) {
      this.message.set("Error: " + error.message);
      this.messageType.set("error");
    } else {
      this.message.set("Registration successful! Check your email to confirm.");
      this.messageType.set("success");
      // Optional delay before navigating
      setTimeout(() => this.router.navigate(["/home"]), 2000);
    }

    // Auto-clear after 5 seconds
    setTimeout(() => {
      this.message.set(null);
      this.messageType.set(null);
    }, 5000);
  }

  navigateToLogin() {
    this.router.navigate(["/login"]);
  }
}
