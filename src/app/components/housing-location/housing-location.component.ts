import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HousingLocation } from "../../interfaces/housing-location.interface";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-housing-location",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./housing-location.component.html",
  styleUrls: ["./housing-location.component.css"],
})
export class HousingLocationComponent {
  // Uses the non-null assertion operator (!) to indicate the input will be initialized by the parent
  @Input() housingLocation!: HousingLocation;
}
