import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { HousingService } from "../../services/housing.service";
import { HousingLocation } from "../../interfaces/housing-location.interface";

// Fake housing data with the same shape as the real backend
const mockHousingData: HousingLocation[] = [
  {
    id: 0,
    name: "Acme Fresh Start Housing",
    city: "Chicago",
    state: "IL",
    photo: "",
    available_units: 4,
    wifi: true,
    laundry: true,
  },
  {
    id: 1,
    name: "Hopeful Apartment Group",
    city: "Oakland",
    state: "CA",
    photo: "",
    available_units: 2,
    wifi: true,
    laundry: true,
  },
  {
    id: 2,
    name: "Homesteady Housing",
    city: "Chicago",
    state: "IL",
    photo: "",
    available_units: 1,
    wifi: true,
    laundry: false,
  },
];

// Creates a fake version of the HousingService for testing
class MockHousingService {
  getAllHousingLocations(): Promise<HousingLocation[]> {
    return Promise.resolve(mockHousingData);
  }
}

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    // Set up the test module using the real component and mocked service
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: HousingService, useClass: MockHousingService }],
    }).compileComponents(); // compiles the template and styles
  }));

  beforeEach(() => {
    // Create an instance of the component before each test
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    // Verifies Angular successfully builds the component
    expect(component).toBeTruthy();
  });

  it(
    "should load housing locations on init",
    waitForAsync(() => {
      // Waits until all async operations finish
      fixture.whenStable().then(() => {
        // After init, both lists should be filled with mock data
        expect(component.originalHousingLocationList.length).toBe(3);
        expect(component.filteredHousingLocationList.length).toBe(3);
      });
    }),
  );

  it(
    "should filter results based on search text",
    waitForAsync(() => {
      fixture.whenStable().then(() => {
        // Simulates user searching for a city and checks filtered results
        component.filterResults("Chicago");
        expect(component.filteredHousingLocationList.length).toBe(2);

        component.filterResults("Oakland");
        expect(component.filteredHousingLocationList.length).toBe(1);

        // Empty search should reset the filter
        component.filterResults("");
        expect(component.filteredHousingLocationList.length).toBe(3);
      });
    }),
  );
});
