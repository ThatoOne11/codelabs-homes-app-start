import { Injectable } from "@angular/core";
import { HousingLocation } from "../interfaces/housing-location";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root", // This service is provided in the root injector, making it available throughout the application
})
export class HousingService {
  private url = `${environment.apiUrl}/locations`; // URL to the housing locations API

  constructor() {}

  // Method to get all housing locations
  async getAllHousingLocations(): Promise<HousingLocation[]> {
    const response = await fetch(this.url);
    return (await response.json()) ?? []; // Fetching all housing locations from the API and returning them as an array of HousingLocation objects
  }

  // Method to get a specific housing location by its ID
  async getHousingLocationById(
    id: number
  ): Promise<HousingLocation | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return await data.json();
  }

  // Method to submit an application
  submitApplication(firstName: string, lastName: string, email: string): void {
    // Here you would typically send the application data to a server or handle it as needed
    console.log(
      `Application submitted for ${firstName} ${lastName} with email ${email}`
    );
  }
}
