import { Utils } from '../public/libs/utils';
const percentageOfFree = 10;

enum CampaignType {
    randomFree = 'rf',
}

export class Campaign {
    public constructor() {}

    // 指定されたキャンペーンタイプの割引を適用する
    public discount(itemPrice: number, campaignType: string): number {
        switch (campaignType) {
            case CampaignType.randomFree:
                return this.randomFree(itemPrice);
            default:
                return itemPrice;
        }
    }

    // 一定確率で全額返金
    private randomFree(itemPrice: number): number {
        const oneHundred = 100;
        if (Utils.randomNumFloor(oneHundred / percentageOfFree) === 0) {
            return 0;
        }
        return itemPrice;
    }
}
