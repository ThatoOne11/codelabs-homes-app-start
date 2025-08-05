import { Injectable } from "@angular/core";
import { HousingLocation } from "../interfaces/housing-location.interface";
import { supabase } from "src/app/services/supabase.service";

@Injectable({
  providedIn: "root",
})
export class HousingService {
  constructor() {}

  async getAllHousingLocations(): Promise<HousingLocation[]> {
    try {
      // Query all rows from the 'locations' table using Supabase client
      const { data, error } = await supabase
        .from("locations")
        .select("*");

      // Throw error if Supabase returns an error object
      if (error) {
        throw new Error(`Failed to fetch locations: ${error.message}`);
      }
      // Return fetched data or empty array if data is null/undefined
      return data ?? [];
    } catch (error) {
      // Log errors from network or Supabase and return empty array
      console.error("Internal Error:", error);
      return [];
    }
  }

  async getHousingLocationById(
    id: number,
  ): Promise<HousingLocation | undefined> {
    try {
      // Query 'locations' table filtering by id and expect a single row
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("id", id)
        .single();

      // Throw error if Supabase returns one for this query
      if (error) {
        throw new Error(
          `Failed to fetch location with ID ${id}: ${error.message}`,
        );
      }
      // Return the single location object or undefined if not found
      return data;
    } catch (error) {
      // Log errors and return undefined on failure
      console.error(`Internal Error:`, error);
      return undefined;
    }
  }

  submitApplication(firstName: string, lastName: string, email: string): void {
    try {
      // Currently just logs the application data to the console
      console.log(
        `Application submitted for ${firstName} ${lastName} with email ${email}`,
      );
    } catch (error) {
      // Catch and log any errors during logging
      console.error("Error submitting application:", error);
    }
  }
}
