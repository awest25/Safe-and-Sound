export class SpatialLocation {
    type: string;
    coordinates: [number, number];

    constructor(type: string, coordinates: [number, number]) {
        this.type = type;
        this.coordinates = coordinates;
    }

    public exportToMapbox(){
        // TODO
    }
}