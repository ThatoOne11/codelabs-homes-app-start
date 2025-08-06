import { Component, inject, OnInit } from "@angular/core";
import { SupabaseService } from "src/app/services/supabase/supabase.service";
import { Router } from "@angular/router";
import { User } from "src/app/types/user.type";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  async ngOnInit() {
    this.user = await this.supabaseService.getUser();
    if (!this.user) {
      alert("You are not logged in. Redirecting to login page.");
    }
  }

  async signOut() {
    await this.supabaseService.signOut();
    this.router.navigate(["/login"]);
  }
}
