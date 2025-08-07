import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { HousingService } from "../../services/housing/housing.service";
import { HousingLocation } from "../../interfaces/housing-location.interface";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-details",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
})
export class DetailsComponent {
  route = inject(ActivatedRoute);
  housingService = inject(HousingService);
  private readonly router = inject(Router);

  housingLocation: HousingLocation | undefined;

  message = signal<string | null>(null);
  messageType = signal<"success" | "error" | null>(null);

  applyForm = new FormGroup({
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  constructor() {
    const housingLocationId = Number(this.route.snapshot.params["id"]);
    this.housingService
      .getHousingLocationById(housingLocationId)
      .then((location) => {
        this.housingLocation = location;
      })
      .catch((error) => {
        console.error(`Failed to load location:`, error);
        this.message.set("Failed to load housing location. Please try again.");
        this.messageType.set("error");
        this.clearMessage();
      });
  }

  submitApplication() {
    try {
      this.housingService.submitApplication(
        this.applyForm.value.firstName ?? "",
        this.applyForm.value.lastName ?? "",
        this.applyForm.value.email ?? "",
      );

      this.message.set("Application submitted successfully!");
      this.messageType.set("success");

      setTimeout(() => {
        this.router.navigate(["/home"]);
      }, 1500);
    } catch (error) {
      console.error("Application submission failed:", error);
      this.message.set("Failed to submit application. Please try again.");
      this.messageType.set("error");
    }

    this.clearMessage();
  }

  private clearMessage() {
    setTimeout(() => {
      this.message.set(null);
      this.messageType.set(null);
    }, 5000);
  }
}
