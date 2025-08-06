import { Component, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SupabaseService } from "./services/supabase/supabase.service";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  imports: [CommonModule, RouterModule],
})
export class AppComponent {
  isLoggedIn = signal(false);

  constructor(private readonly supabase: SupabaseService) {
    this.listenToAuth();
  }

  private async listenToAuth() {
    // Listen to auth state changes (including initial load)
    this.supabase.onAuthStateChange((_event, session) => {
      this.isLoggedIn.set(!!session?.user);
    });

    // Optional: force check on component init
    const user = await this.supabase.getUser();
    this.isLoggedIn.set(!!user);
  }
}
