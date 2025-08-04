import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HousingLocationComponent } from "./housing-location.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HousingLocation } from "../../interfaces/housing-location.interface";

describe("HousingLocationComponent", () => {
  let component: HousingLocationComponent;
  let fixture: ComponentFixture<HousingLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingLocationComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HousingLocationComponent);
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
      availableUnits: 5,
      wifi: true,
      laundry: false,
    };

    fixture.detectChanges(); // updates template with input

    const anchor: HTMLAnchorElement | null =
      fixture.nativeElement.querySelector("a");

    // Check if the link points to the correct details page
    expect(anchor?.getAttribute("href")).toBe("/details/1");
  });
});
