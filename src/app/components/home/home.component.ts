import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HousingLocationComponent } from "../housing-location/housing-location.component";
import { HousingLocation } from "../../interfaces/housing-location";
import { HousingService } from "../../services/housing.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, HousingLocationComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  housingService: HousingService = inject(HousingService); // Injecting the HousingService to access housing data
  filteredLocationList: HousingLocation[] = []; // This will hold the filtered list of housing locations based on user input

  // Constructor to initialize the housingLocationList by calling the getAllHousingLocations method from HousingService
  // This method retrieves all housing locations and assigns them to the housingLocationList property/array, meaning it returns an array of HousingLocation objects, which are then stored in the housingLocationList property
  // This allows the component to display a list of housing locations on the home page
  // The housingLocationList is then used in the template to render each housing location using the HousingLocationComponent
  // The component uses Angular's injection dependency to get an instance of the HousingService, which is responsible for managing housing data
  // The HousingService provides methods to retrieve all housing locations and specific housing locations by ID
  // This approach promotes separation of concerns, allowing the HomeComponent to focus strictly on displaying data while the HousingService handles data retrieval and management
  // Fetching the housing location details using the HousingService
  constructor() {
    this.housingService.getAllHousingLocations().then((locations) => {
      this.housingLocationList = locations;
      this.filteredLocationList = locations; // Initialize filtered list with all locations
    });
  }

  // Method to filter housing locations based on the city name
  filterResults(text: string) {
    if (!text) this.filteredLocationList = this.housingLocationList; // If no text is provided, show all locations
    // Filter the housingLocationList based on the city name, converting both to lowercase for case-insensitive comparison
    this.filteredLocationList = this.housingLocationList.filter(
      (housingLocation) =>
        housingLocation?.city.toLowerCase().includes(text.toLowerCase())
    );
  }
}
