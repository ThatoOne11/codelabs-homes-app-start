import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DetailsComponent } from "./details.component";
import { ActivatedRoute } from "@angular/router";
import { HousingService } from "../../services/housing.service";
import { ReactiveFormsModule } from "@angular/forms";
import { HousingLocation } from "../../interfaces/housing-location.interface";
import { CommonModule } from "@angular/common";

// Fake location object to simulate backend data
const mockHousingLocation: HousingLocation = {
  id: 1,
  name: "Test Housing",
  city: "Test City",
  state: "TS",
  photo: "test.jpg",
  availableUnits: 3,
  wifi: true,
  laundry: false,
};

// Simulates route parameters coming from the URL
const mockActivatedRoute = {
  snapshot: {
    params: {
      id: "1",
    },
  },
};

// Fake HousingService using Jasmine spies to track method calls
const mockHousingService = {
  getHousingLocationById: jasmine
    .createSpy("getHousingLocationById")
    .and.returnValue(Promise.resolve(mockHousingLocation)),
  submitApplication: jasmine.createSpy("submitApplication"),
};

describe("DetailsComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, DetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HousingService, useValue: mockHousingService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch housing location on init", async () => {
    await fixture.whenStable(); // waits for the Promise in the constructor
    expect(mockHousingService.getHousingLocationById).toHaveBeenCalledWith(1);
    expect(component.housingLocation).toEqual(mockHousingLocation);
  });

  it("should call submitApplication with form values", () => {
    component.applyForm.setValue({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    });

    component.submitApplication();

    expect(mockHousingService.submitApplication).toHaveBeenCalledWith(
      "John",
      "Doe",
      "john@example.com"
    );
  });

  it("should handle empty form values with fallback to empty strings", () => {
    component.applyForm.setValue({
      firstName: null,
      lastName: null,
      email: "",
    });

    component.submitApplication();

    expect(mockHousingService.submitApplication).toHaveBeenCalledWith(
      "",
      "",
      ""
    );
  });
});
