import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HousingLocation } from "../../interfaces/housing-location.interface";
import { RouterModule } from "@angular/router";

@Component({
  selector: "housing-location-card",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./housing-location-card.component.html",
  styleUrls: ["./housing-location-card.component.css"],
})
export class HousingLocationCardComponent {
  // Uses the non-null assertion operator (!) to indicate the input will be initialized by the parent
  @Input()
  housingLocation!: HousingLocation;
}
