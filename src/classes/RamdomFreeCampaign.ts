import { Campaign } from './Campaign';
import { Utils } from '../public/libs/utils';
const percentageOfFree = 10;

export class RamdomFreeCampaign extends Campaign {
    public constructor() {
        super();
    }

    // 一定確率で全額返金
    public discount(itemPrice: number): number {
        const oneHundred = 100;
        if (Utils.randomNumFloor(oneHundred / percentageOfFree) === 0) {
            return 0;
        }
        return itemPrice;
    }
}
