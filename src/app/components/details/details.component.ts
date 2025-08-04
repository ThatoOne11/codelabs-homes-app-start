import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HousingService } from "../../services/housing.service";
import { HousingLocation } from "../../interfaces/housing-location.interface";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

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

  housingLocation: HousingLocation | undefined;

  applyForm = new FormGroup({
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    email: new FormControl(""),
  });

  constructor() {
    const housingLocationId = Number(this.route.snapshot.params["id"]);
    this.housingService
      .getHousingLocationById(housingLocationId)
      .then((location) => {
        this.housingLocation = location;
      })
      .catch((error) => {
        console.error(
          `Failed to load location with ID ${housingLocationId}:`,
          error
        );
      });
  }

  submitApplication() {
    try {
      this.housingService.submitApplication(
        this.applyForm.value.firstName ?? "",
        this.applyForm.value.lastName ?? "",
        this.applyForm.value.email ?? ""
      );
    } catch (error) {
      console.error("Application submission failed:", error);
    }
  }
}
