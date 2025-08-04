import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { DetailsComponent } from "./components/details/details.component";

const routeConfig: Routes = [
  {
    path: "",
    component: HomeComponent,
    title: "Home page",
  }, // This is the default route that will be loaded when the application starts
  {
    path: "details/:id",
    component: DetailsComponent,
    title: "Details page",
  }, // This route will load the DetailsComponent when the URL matches 'details/:id'
];

export default routeConfig;
