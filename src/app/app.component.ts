import { Component, computed, inject, signal } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { SupabaseService } from "./services/supabase/supabase.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  imports: [CommonModule, RouterModule],
})
export class AppComponent {
  isLoggedIn = signal(false);
  currentUrl = signal("");

  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);

  constructor() {
    this.listenToAuth();
    this.listenToRoute();
  }

  private async listenToAuth() {
    this.supabase.onAuthStateChange((_event, session) => {
      this.isLoggedIn.set(!!session?.user);
    });

    const user = await this.supabase.getUser();
    this.isLoggedIn.set(!!user);
  }

  //Method to listen to route changes and update currentUrl signal
  //This is used to determine if the profile icon should be shown based on the current route
  private listenToRoute() {
    // Initialize currentUrl with the current router URL on app load
    this.currentUrl.set(this.router.url);

    // Listen to route changes and update currentUrl signal
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  // Computed signal to determine if the profile icon should be shown
  // It checks if the user is logged in and if the current URL is not login or signup
  showProfile = computed(() => {
    const url = this.currentUrl();
    return (
      this.isLoggedIn() &&
      url !== "/login" &&
      url !== "/signup"
    );
  });
}
