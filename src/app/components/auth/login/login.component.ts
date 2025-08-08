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
  email = "";
  password = "";

  message = signal<string | null>(null);
  messageType = signal<"success" | "error" | null>(null);

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  async signInWithEmail() {
    const { error } = await this.supabaseService.signInWithEmail({
      email: this.email,
      password: this.password,
    });

    if (error) {
      this.message.set("Error: " + error.message);
      this.messageType.set("error");
    } else {
      this.message.set("Signed in successfully!");
      this.messageType.set("success");

      setTimeout(() => this.router.navigate(["/home"]), 1000);
    }

    setTimeout(() => {
      this.message.set(null);
      this.messageType.set(null);
    }, 5000);
  }

  navigateToSignup() {
    this.router.navigate(["/signup"]);
  }
}
