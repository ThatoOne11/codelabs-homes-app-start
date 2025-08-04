import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HousingLocationComponent } from "../housing-location/housing-location.component";
import { HousingLocation } from "../../interfaces/housing-location.interface";
import { HousingService } from "../../services/housing.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, HousingLocationComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  originalHousingLocationList: HousingLocation[] = [];
  filteredHousingLocationList: HousingLocation[] = [];

  private housingService = inject(HousingService);

  constructor() {
    this.housingService
      .getAllHousingLocations()
      .then((locations) => {
        // Initializes both the full list and filtered list with fetched data
        this.originalHousingLocationList = locations;
        this.filteredHousingLocationList = locations;
      })
      .catch((error) => {
        console.error("Error fetching housing locations:", error);
      });
  }

  filterResults(searchText: string) {
    // Resets the filtered list when the search field is empty
    if (!searchText) {
      this.filteredHousingLocationList = this.originalHousingLocationList;
      return;
    }
    // Performs case-insensitive match against city names
    this.filteredHousingLocationList = this.originalHousingLocationList.filter(
      (location) =>
        location.city.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
