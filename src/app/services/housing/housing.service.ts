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

  // Method to search for housing locations based on a search string
  // This method is used in HomeComponent to filter locations based on user input
  // It returns an array of HousingLocation objects that match the search criteria
  async getFilteredLocations(search: string): Promise<HousingLocation[]> {
    try {
      const { data, error } = await this.supabase.searchLocations(search);

      if (error) {
        throw new Error(`Failed to search locations: ${error.message}`);
      }

      return data ?? [];
    } catch (error) {
      console.error("Search Error:", error);
      return [];
    }
  }

  submitApplication(firstName: string, lastName: string, email: string): void {
    // TODO: send the application data to a backend service
    try {
      console.log(
        `Application submitted for ${firstName} ${lastName} with email ${email}`,
      );
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  }
}
