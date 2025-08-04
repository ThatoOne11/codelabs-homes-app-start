import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HousingService } from "../../services/housing.service";
import { HousingLocation } from "../../interfaces/housing-location";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms"; // Importing ReactiveFormsModule to handle forms in the component

@Component({
  selector: "app-details",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],

  // Displaying the ID of the housing location, The ? operator is used to safely access the id property, ensuring that it does not throw an error if housingLocation is undefined
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute); // Injecting ActivatedRoute to access route parameters
  housingService: HousingService = inject(HousingService); // Injecting HousingService to access housing data
  housingLocation: HousingLocation | undefined; // Property to hold the housing location details
  
  applyForm = new FormGroup({
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    email: new FormControl(""),
  });

  // Constructor to initialize the housingLocation by fetching it using the ID from the route parameters
  // The ID is extracted from the route parameters using ActivatedRoute's result
  // The getHousingLocationById method from HousingService is called to retrieve the housing location
  // The housingLocation property is typed as HousingLocation or undefined to handle cases where the location might not be found, then populated with the retrieved data, allowing the component to display the details of the specific housing location
  // This allows the component to dynamically load and display details of a specific housing location based on the ID provided in the route
  constructor() {
    const housingLocationId = Number(this.route.snapshot.params["id"]); // Extracting the ID from the route parameters
    // Fetching the housing location details using the HousingService
    this.housingService.getHousingLocationById(housingLocationId).then((location) => {
      this.housingLocation = location; // Assigning the fetched location to the housingLocation property
    });
  }
  // Submitting the application using the HousingService
  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? "",
      this.applyForm.value.lastName ?? "",
      this.applyForm.value.email ?? ""
    ); 
  }
}
