import { Injectable } from "@angular/core";
import { HousingLocation } from "../interfaces/housing-location.interface";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class HousingService {
  private url = `${environment.apiUrl}/locations`;

  constructor() {}

  async getAllHousingLocations(): Promise<HousingLocation[]> {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        // Handles HTTP errors (e.g. 404, 500)
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
      }
      return (await response.json()) ?? [];
    } catch (error) {
      // Catches network errors or JSON parsing issues
      console.error("Error fetching all housing locations:", error);
      return [];
    }
  }

  async getHousingLocationById(
    id: number
  ): Promise<HousingLocation | undefined> {
    try {
      const response = await fetch(`${this.url}/${id}`);
      if (!response.ok) {
        throw new Error(
          `Location with ID ${id} not found: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching housing location with ID ${id}:`, error);
      return undefined;
    }
  }

  submitApplication(firstName: string, lastName: string, email: string): void {
    // TODO: Placeholder for future API call; currently logs submission
    try {
      console.log(
        `Application submitted for ${firstName} ${lastName} with email ${email}`
      );
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  }
}
