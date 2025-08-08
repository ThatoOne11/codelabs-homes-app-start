import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HousingLocationCardComponent } from "./housing-location-card.component";
import { ActivatedRoute } from "@angular/router";
import { HousingLocation } from "../../interfaces/housing-location.interface";
import { By } from "@angular/platform-browser";

describe("HousingLocationCardComponent", () => {
    let component: HousingLocationCardComponent;
    let fixture: ComponentFixture<HousingLocationCardComponent>;

    const mockLocation: HousingLocation = {
        id: 42,
        name: "Sunny Apartments",
        city: "Testville",
        state: "TS",
        photo: "sunny.jpg",
        available_units: 10,
        wifi: true,
        laundry: false,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HousingLocationCardComponent],
            providers: [
                { provide: ActivatedRoute, useValue: {} }, // <-- Add this!
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HousingLocationCardComponent);
        component = fixture.componentInstance;
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should display the housing location name and city in template", () => {
        component.housingLocation = mockLocation;
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain(mockLocation.name);
        expect(compiled.textContent).toContain(mockLocation.city);
    });

    it("should render image with correct src and alt attributes", () => {
        component.housingLocation = mockLocation;
        fixture.detectChanges();

        const img = fixture.debugElement.query(By.css("img"));
        expect(img).toBeTruthy();
        expect(img.nativeElement.src).toContain(mockLocation.photo);
        expect(img.nativeElement.alt).toContain(mockLocation.name);
    });
});
