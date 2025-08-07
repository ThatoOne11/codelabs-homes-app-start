import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth/auth.guard";
import { DetailsComponent } from "./components/details/details.component";
import { HomeComponent } from "./components/home/home.component";
import { authRedirectGuard } from "../app/guards/auth-redirect/auth-redirect.guard";

const routeConfig: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  }, // Redirect empty path to login
  {
    path: "login",
    loadComponent: () =>
      import("./components/auth/login/login.component").then(
        (m) => m.LoginComponent,
      ),
    canActivate: [authRedirectGuard], // Redirect logged-in users away from login
    title: "Login page",
  }, // Login
  {
    path: "signup",
    loadComponent: () =>
      import("./components/auth/signup/signup.component").then(
        (m) => m.SignupComponent,
      ),
    canActivate: [authRedirectGuard], // Redirect logged-in users away from signup
    title: "Signup page",
  }, // Signup
  {
    path: "home",
    component: HomeComponent,
    canActivate: [authGuard], // Protect Home page
    title: "Home page",
  },
  {
    path: "details/:id",
    component: DetailsComponent,
    canActivate: [authGuard], // Protect Details page
    title: "Details page",
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./components/profile/profile.component").then(
        (m) => m.ProfileComponent,
      ),
    canActivate: [authGuard], // Protect Profile page
    title: "Profile page",
  },
  {
    path: "**",
    redirectTo: "/home",
  }, // Redirect any unknown path to home
];

export default routeConfig;
