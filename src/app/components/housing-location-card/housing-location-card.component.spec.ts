import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HousingLocationCardComponent } from "./housing-location-card.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HousingLocation } from "../../interfaces/housing-location.interface";

describe("HousingLocationComponent", () => {
  let component: HousingLocationCardComponent;
  let fixture: ComponentFixture<HousingLocationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingLocationCardComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HousingLocationCardComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should render a link to the location details page", () => {
    // Provide test input
    component.housingLocation = {
      id: 1,
      name: "Test Location",
      city: "Test City",
      state: "TS",
      photo: "test.jpg",
      available_units: 5,
      wifi: true,
      laundry: false,
    };

    fixture.detectChanges(); // updates template with input

    const anchor: HTMLAnchorElement | null = fixture.nativeElement
      .querySelector("a");

    // Check if the link points to the correct details page
    expect(anchor?.getAttribute("href")).toBe("/details/1");
  });
});
