import { Car } from './Car';
import { Share } from './Share';
export class Solicitation {
    share: Share;
    car: Car;

    constructor (share, car) {
        this.share = share;
        this.car = car;
    }

}