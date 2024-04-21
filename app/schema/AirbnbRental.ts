import { SpatialLocation } from './SpatialLocation';

export class AirbnbRental {
    constructor(
        public _id: number,
        public location: SpatialLocation,
        public listing_url: string,
        public name: string,
        public description: string,
        public picture_url: string,
        public host_location: string,
        public host_about: string,
        public price: string, // this shouldnt be a string but whatever
        public distance: number

    ) {
        // nothing to do in constructor
    }

}