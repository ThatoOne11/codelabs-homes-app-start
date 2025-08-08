import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from "@angular/core/testing";
import { DetailsComponent } from "./details.component";
import { HousingService } from "../../services/housing/housing.service";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";

describe("DetailsComponent", () => {
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;
    let housingServiceSpy: jasmine.SpyObj<HousingService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const housingSpy = jasmine.createSpyObj("HousingService", [
            "getHousingLocationById",
            "submitApplication",
        ]);

        housingSpy.getHousingLocationById.and.returnValue(
            Promise.resolve({
                id: 1,
                name: "Test Place",
                city: "Test City",
                state: "TS",
                photo: "test.jpg",
                available_units: 5,
                wifi: true,
                laundry: false,
            }),
        );

        const activatedRouteStub = {
            snapshot: { params: { id: "1" } },
        };

        // Key fix: Make router.navigate return true synchronously, not a Promise
        const routerSpyObj = jasmine.createSpyObj("Router", {
            navigate: true, // synchronous true return instead of Promise.resolve(true)
        });

        await TestBed.configureTestingModule({
            imports: [DetailsComponent],
            providers: [
                { provide: HousingService, useValue: housingSpy },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: Router, useValue: routerSpyObj },
            ],
        }).compileComponents();

        housingServiceSpy = TestBed.inject(HousingService) as jasmine.SpyObj<
            HousingService
        >;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture = TestBed.createComponent(DetailsComponent);
        component = fixture.componentInstance;
    });

    it(
        "should load housing location on init",
        fakeAsync(() => {
            const mockLocation = {
                id: 1,
                name: "Test Place",
                city: "Test City",
                state: "TS",
                photo: "test.jpg",
                available_units: 5,
                wifi: true,
                laundry: false,
            };

            housingServiceSpy.getHousingLocationById.and.returnValue(
                Promise.resolve(mockLocation),
            );

            fixture.detectChanges(); // triggers constructor

            tick(); // wait for async promise

            expect(component.housingLocation).toEqual(mockLocation);
        }),
    );

    it(
        "should submit application and navigate home",
        fakeAsync(() => {
            housingServiceSpy.submitApplication.and.returnValue();

            component.applyForm.setValue({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
            });

            component.submitApplication();

            expect(housingServiceSpy.submitApplication).toHaveBeenCalledWith(
                "John",
                "Doe",
                "john@example.com",
            );

            // advance time for 1500ms delay in setTimeout that navigates home
            tick(1500);

            expect(routerSpy.navigate).toHaveBeenCalledWith(["/home"]);

            flush();
        }),
    );
});
