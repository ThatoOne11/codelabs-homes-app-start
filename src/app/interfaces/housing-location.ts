export interface HousingLocation { //interface defining the structure of a housing location
    id: number,
    name: string,
    city: string,
    state: string,
    photo: string,
    availableUnits: number,
    wifi: boolean,
    laundry: boolean
}
