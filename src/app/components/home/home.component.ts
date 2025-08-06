import { Component, effect, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HousingLocationCardComponent } from "../housing-location-card/housing-location-card.component";
import { HousingLocation } from "../../interfaces/housing-location.interface";
import { HousingService } from "../../services/housing/housing.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, HousingLocationCardComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  private housingService = inject(HousingService);

  housingLocations = signal<HousingLocation[]>([]);
  searchText = signal("");

  private debounceTimer: any;

  constructor() {
    this.loadLocations(); // Load all locations initially

    // Debounced effect — reacts to changes in searchText
    effect(() => {
      const value = this.searchText();

      clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        this.loadLocations(value);
      }, 300); // <-- debounce time in ms
    });
  }

  async loadLocations(search: string = "") {
    try {
      const results = await this.housingService.getFilteredLocations(search);
      this.housingLocations.set(results);
    } catch (error) {
      console.error("Error loading housing locations:", error);
      alert("Failed to load housing locations. Please try again later.");
    }
  }

  updateSearch(value: string) {
    this.searchText.set(value);
  }
}
