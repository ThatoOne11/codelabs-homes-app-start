import { TestBed } from "@angular/core/testing";
import { HousingService } from "./housing.service";
import { HousingLocation } from "../interfaces/housing-location.interface";

describe("HousingService", () => {
  let service: HousingService;

  const mockHousingList: HousingLocation[] = [
    {
      id: 1,
      name: "Sample House",
      city: "Cape Town",
      state: "WC",
      photo: "",
      availableUnits: 2,
      wifi: true,
      laundry: true,
    },
    {
      id: 2,
      name: "Urban Stay",
      city: "Joburg",
      state: "GP",
      photo: "",
      availableUnits: 3,
      wifi: false,
      laundry: false,
    },
  ];

  beforeEach(() => {
    // Prepare the test environment and get the service ready
    TestBed.configureTestingModule({});
    service = TestBed.inject(HousingService);
  });

  afterEach(() => {
    // Clear any fake fetch calls after each test so they don’t affect others
    (globalThis.fetch as any)?.mockClear?.();
  });

  describe("getAllHousingLocations", () => {
    it("should return a list of housing locations on success", async () => {
      // Pretend the fetch call worked and returned our mock list
      spyOn(window, "fetch").and.resolveTo(
        new Response(JSON.stringify(mockHousingList), {
          status: 200,
          statusText: "OK",
        })
      );

      const result = await service.getAllHousingLocations();
      expect(result.length).toBe(2);
      expect(result[0].name).toBe("Sample House");
    });

    it("should return an empty array if fetch fails", async () => {
      // Pretend fetch failed with an error
      spyOn(window, "fetch").and.rejectWith(new Error("Network error"));

      const result = await service.getAllHousingLocations();
      expect(result).toEqual([]);
    });
  });

  describe("getHousingLocationById", () => {
    it("should return a single housing location when found", async () => {
      const mockLocation = mockHousingList[0];

      // Pretend fetch returned one housing location
      spyOn(window, "fetch").and.resolveTo(
        new Response(JSON.stringify(mockLocation), {
          status: 200,
          statusText: "OK",
        })
      );

      const result = await service.getHousingLocationById(1);
      expect(result?.id).toBe(1);
      expect(result?.name).toBe("Sample House");
    });

    it("should return undefined if fetch fails", async () => {
      // Pretend fetch threw an error so we test error handling
      spyOn(window, "fetch").and.rejectWith(new Error("Something went wrong"));

      const result = await service.getHousingLocationById(1);
      expect(result).toBeUndefined();
    });
  });

  describe("submitApplication", () => {
    it("should log the application details", () => {
      // Watch console.log to check if it’s called properly
      spyOn(console, "log");

      service.submitApplication("Jane", "Doe", "jane@example.com");

      expect(console.log).toHaveBeenCalledWith(
        "Application submitted for Jane Doe with email jane@example.com"
      );
    });

    it("should catch and log error if console.log throws", () => {
      // Make console.log throw an error to test our error catcher
      spyOn(console, "log").and.throwError("Console broken");
      spyOn(console, "error");

      service.submitApplication("Foo", "Bar", "foo@bar.com");

      // Check if our service catches the error and logs it
      expect(console.error).toHaveBeenCalledWith(
        "Error submitting application:",
        jasmine.any(Error)
      );
    });
  });
});
