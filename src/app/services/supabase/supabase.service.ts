import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "../../../environments/environment";
import { LoginPayload, SignupPayload } from "../../types/user.type";

@Injectable({
    providedIn: "root",
})
export class SupabaseService {
    private readonly supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            environment.supabaseAPIUrl,
            environment.supabaseAnonKey,
        );
    }

    async signInWithEmail(payload: LoginPayload) {
        return await this.supabase.auth.signInWithPassword({
            email: payload.email,
            password: payload.password,
        });
    }

    async signUpWithEmail(payload: SignupPayload) {
        return await this.supabase.auth.signUp({
            email: payload.email,
            password: payload.password,
            options: {
                data: {
                    displayName: payload.name,
                },
            },
        });
    }

    async getUser() {
        const { data, error } = await this.supabase.auth.getUser();
        if (error || !data.user) {
            return null;
        }
        return data.user;
    }

    async signOut() {
        return await this.supabase.auth.signOut();
    }

    // Method for housing locations (Put this here to avoid exposing Supabase client directly)
    async getLocations() {
        return this.supabase.from("locations").select("*");
    }

    // Method to get a housing location by ID (Put this here to avoid exposing Supabase client directly)
    async getHousingLocationById(id: number) {
        return this.supabase.from("locations").select("*").eq("id", id)
            .single();
    }

    // Method to search locations based on a search string
    async searchLocations(search: string) {
        const trimmed = search.trim().toLowerCase();

        // If no search string, return all
        if (!trimmed) {
            return this.getLocations();
        }

        return this.supabase
            .from("locations")
            .select("*")
            .or(
                `name.ilike.%${trimmed}%,city.ilike.%${trimmed}%`,
            ); // searches in both name and city columns
    }

    //Method to check if a user email exists
    // This method is used in SignupComponent to check if the email already exists
    async checkUserEmailExists(email: string): Promise<boolean> {
        const response = await fetch(
            `${environment.supabaseAPIUrl}/functions/v1/check-user-email`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // No Authorization header with service role key needed here!
                    // The Supabase Function will handle authentication/authorization internally.
                },
                body: JSON.stringify({ email }),
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to check user email");
        }

        const data = await response.json();
        return data.exists;
    }

    // Method to listen to auth state changes for the application and update the user state to display the correct UI/navbar with the profile icon
    onAuthStateChange(
        callback: Parameters<typeof this.supabase.auth.onAuthStateChange>[0],
    ) {
        return this.supabase.auth.onAuthStateChange(callback);
    }
}
