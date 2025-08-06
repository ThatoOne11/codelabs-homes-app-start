import { Injectable } from "@angular/core";
import { HousingLocation } from "../../interfaces/housing-location.interface";
import { SupabaseService } from "../supabase/supabase.service";
import { inject } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HousingService {
  private readonly supabase = inject(SupabaseService);

  // Method to get all housing locations
  // This method is used in HomeComponent to fetch all locations initially
  // It returns an array of HousingLocation objects or an empty array if no locations are found
  async getAllHousingLocations(): Promise<HousingLocation[]> {
    try {
      const { data, error } = await this.supabase.getLocations();

      if (error) {
        throw new Error(`Failed to fetch locations: ${error.message}`);
      }

      return data ?? [];
    } catch (error) {
      console.error("Internal Error:", error);
      return [];
    }
  }

  // Method to get a housing location by ID
  // This method is used in HousingLocationCardComponent to fetch details of a specific location
  // It returns a single HousingLocation object or undefined if not found
  async getHousingLocationById(
    id: number,
  ): Promise<HousingLocation | undefined> {
    try {
      const { data, error } = await this.supabase.getHousingLocationById(id);

      if (error) {
        throw new Error(
          `Failed to fetch location with ID ${id}: ${error.message}`,
        );
      }

      return data;
    } catch (error) {
      console.error(`Internal Error:`, error);
      return undefined;
    }
  }

  // Method to get filtered housing locations based on search text
  // This method is used in HomeComponent to filter locations based on user input
  async getFilteredLocations(search: string): Promise<HousingLocation[]> {
    const { data, error } = await this.supabase.getLocations();
    if (error || !data) throw new Error("Failed to fetch housing locations");

    const query = search.toLowerCase().trim();

    if (!query) return data;

    return data.filter((location) =>
      `${location.name} ${location.city}`.toLowerCase().includes(query)
    );
  }

  submitApplication(firstName: string, lastName: string, email: string): void {
    try {
      console.log(
        `Application submitted for ${firstName} ${lastName} with email ${email}`,
      );
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  }
}
