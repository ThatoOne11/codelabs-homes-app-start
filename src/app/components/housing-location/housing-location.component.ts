import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HousingLocation } from "../../interfaces/housing-location"; //importing the interface
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-housing-location",
  standalone: true,
  imports: [CommonModule, RouterModule], //importing CommonModule for Angular directives and RouterModule for routing

  //dynamic component that displays housing location details
  //uses HousingLocation interface to define the structure of the data
  //uses Input decorator to receive housingLocation data from parent component
  templateUrl: "./housing-location.component.html",
  styleUrls: ["./housing-location.component.css"],
})
export class HousingLocationComponent {
  //the ! operator checks that housingLocation will be provided by the parent component
  //this component will display the details of a house including its photo, name, and location
  @Input() housingLocation!: HousingLocation; //using the HousingLocation interface to type the input property
}
