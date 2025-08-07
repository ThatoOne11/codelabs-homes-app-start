import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SupabaseService } from "src/app/services/supabase/supabase.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent {
  name: string = "";
  email: string = "";
  password: string = "";

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  async signUp() {
    const { error } = await this.supabaseService.signUpWithEmail({
      name: this.name,
      email: this.email,
      password: this.password,
    });
    if (error) {
      alert("Error signing up: " + error.message);
    } else {
      alert(
        "Registration successful! Please check your email for confirmation.",
      );
      this.router.navigate(["/home"]);
    }
  }

  navigateToLogin() {
    this.router.navigate(["/login"]);
  }
}
