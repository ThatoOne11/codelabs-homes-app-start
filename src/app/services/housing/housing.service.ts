import { Injectable } from "@angular/core";
import { HousingLocation } from "../../interfaces/housing-location.interface";
import { SupabaseService } from "../supabase/supabase.service";
import { inject } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HousingService {
  private readonly supabase = inject(SupabaseService);

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
