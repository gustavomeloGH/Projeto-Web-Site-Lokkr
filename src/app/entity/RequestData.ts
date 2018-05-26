import { User } from './User';
import { Share } from './Share';
export class RequestData {
    share: Share;
    user: User;

    constructor(share, user) {
        this.share = share;
        this.user = user;
    }
}