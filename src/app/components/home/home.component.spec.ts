import {
    ComponentFixture,
    fakeAsync,
    flushMicrotasks,
    TestBed,
    tick,
} from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { HousingService } from "../../services/housing/housing.service";
import { HousingLocation } from "../../interfaces/housing-location.interface";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("HomeComponent", () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let housingServiceSpy: jasmine.SpyObj<HousingService>;

    const mockLocations: HousingLocation[] = [
        {
            id: 1,
            name: "Test Place",
            city: "Test City",
            state: "TS",
            photo: "test.jpg",
            available_units: 5,
            wifi: true,
            laundry: false,
        },
    ];

    beforeEach(async () => {
        const spy = jasmine.createSpyObj("HousingService", [
            "getFilteredLocations",
        ]);

        await TestBed.configureTestingModule({
            imports: [HomeComponent], // standalone component import
            providers: [{ provide: HousingService, useValue: spy }],
            schemas: [NO_ERRORS_SCHEMA], // ignore child component template errors
        }).compileComponents();

        housingServiceSpy = TestBed.inject(HousingService) as jasmine.SpyObj<
            HousingService
        >;
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
    });

    it(
        "should load all housing locations initially",
        fakeAsync(() => {
            housingServiceSpy.getFilteredLocations.and.returnValue(
                Promise.resolve(mockLocations),
            );

            fixture.detectChanges();

            // Move time forward by debounce delay to clear any timers
            tick(300);

            flushMicrotasks();

            expect(housingServiceSpy.getFilteredLocations).toHaveBeenCalledWith(
                "",
            );
            expect(component.housingLocations()).toEqual(mockLocations);
        }),
    );

    it(
        "should update housing locations when searchText changes with debounce",
        fakeAsync(() => {
            // Arrange initial call returns empty results so constructor call works
            housingServiceSpy.getFilteredLocations.and.returnValue(
                Promise.resolve([]),
            );

            fixture.detectChanges();
            flushMicrotasks();

            // Reset spy calls to ignore the constructor call
            housingServiceSpy.getFilteredLocations.calls.reset();

            // Mock filtered results for the search 'test'
            housingServiceSpy.getFilteredLocations.and.returnValue(
                Promise.resolve(mockLocations),
            );

            // Act: update search text
            component.updateSearch("test");

            // Trigger Angular change detection (so the effect runs)
            fixture.detectChanges();

            // Advance time past debounce delay
            tick(300);

            // Wait for any async promises
            flushMicrotasks();

            // Assert
            expect(housingServiceSpy.getFilteredLocations).toHaveBeenCalledWith(
                "test",
            );
            expect(component.housingLocations()).toEqual(mockLocations);
        }),
    );
});
