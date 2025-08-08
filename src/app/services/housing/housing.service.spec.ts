import { TestBed } from "@angular/core/testing";
import { HousingService } from "./housing.service";
import { SupabaseService } from "../supabase/supabase.service";
import { HousingLocation } from "../../interfaces/housing-location.interface";

// Full mock data matching your interface exactly
const mockLocations: HousingLocation[] = [
    {
        id: 1,
        name: "Cozy Cottage",
        city: "Springfield",
        state: "IL",
        photo: "cozy-cottage.jpg",
        available_units: 3,
        wifi: true,
        laundry: false,
    },
    {
        id: 2,
        name: "Urban Flat",
        city: "Chicago",
        state: "IL",
        photo: "urban-flat.jpg",
        available_units: 1,
        wifi: false,
        laundry: true,
    },
];

// Mock SupabaseService with stubbed methods
class MockSupabaseService {
    getLocations() {
        return Promise.resolve({ data: mockLocations, error: null });
    }

    getHousingLocationById(id: number) {
        const location = mockLocations.find((loc) => loc.id === id) ?? null;
        return Promise.resolve({ data: location, error: null });
    }

    searchLocations(search: string) {
        const trimmed = search.trim().toLowerCase();
        if (!trimmed) {
            return Promise.resolve({ data: mockLocations, error: null });
        }
        const filtered = mockLocations.filter(
            (loc) =>
                loc.name.toLowerCase().includes(trimmed) ||
                loc.city.toLowerCase().includes(trimmed),
        );
        return Promise.resolve({ data: filtered, error: null });
    }
}

describe("HousingService", () => {
    let service: HousingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                HousingService,
                { provide: SupabaseService, useClass: MockSupabaseService },
            ],
        });

        service = TestBed.inject(HousingService);
    });

    it("should return all housing locations", async () => {
        const locations = await service.getAllHousingLocations();
        expect(locations.length).toBe(2);
        expect(locations).toEqual(mockLocations);
    });

    it("should return a housing location by ID", async () => {
        const location = await service.getHousingLocationById(1);
        expect(location).toEqual(mockLocations[0]);
    });

    it("should return undefined if housing location ID not found", async () => {
        const location = await service.getHousingLocationById(999);
        expect(location).toBeNull(); // Mock returns null, service returns data as is, adjust if you want undefined instead
    });

    it("should return filtered locations matching search string", async () => {
        const filtered = await service.getFilteredLocations("spring");
        expect(filtered.length).toBe(1);
        expect(filtered[0].city.toLowerCase()).toContain("springfield");
    });

    it("should return all locations if search string is empty", async () => {
        const filtered = await service.getFilteredLocations("");
        expect(filtered.length).toBe(mockLocations.length);
    });

    it("should return empty array if no match found", async () => {
        const filtered = await service.getFilteredLocations("nomatch");
        expect(filtered.length).toBe(0);
    });

    it("submitApplication should not throw error", () => {
        expect(() =>
            service.submitApplication("Jane", "Doe", "jane@example.com")
        ).not.toThrow();
    });
});
