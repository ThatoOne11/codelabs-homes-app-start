import { Component, inject, signal } from "@angular/core";
import { SupabaseService } from "src/app/services/supabase/supabase.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email: string = "";
  password: string = "";

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  async signInWithEmail() {
    const { error } = await this.supabaseService.signInWithEmail({
      email: this.email,
      password: this.password,
    });
    if (error) {
      alert("Error signing in: " + error.message);
    } else {
      this.router.navigate(["/home"]);
    }
  }

  navigateToSignup() {
    this.router.navigate(["/signup"]);
  }
}
