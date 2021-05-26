"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = void 0;
var utils_1 = require("../public/libs/utils");
var percentageOfFree = 10;
var CampaignType;
(function (CampaignType) {
    CampaignType["randomFree"] = "rf";
})(CampaignType || (CampaignType = {}));
var Campaign = /** @class */ (function () {
    function Campaign() {
    }
    // 指定されたキャンペーンタイプの割引を適用する
    Campaign.prototype.discount = function (itemPrice, campaignType) {
        switch (campaignType) {
            case CampaignType.randomFree:
                return this.randomFree(itemPrice);
            default:
                return itemPrice;
        }
    };
    // 一定確率で全額返金
    Campaign.prototype.randomFree = function (itemPrice) {
        var oneHundred = 100;
        if (utils_1.Utils.randomNumFloor(oneHundred / percentageOfFree) === 0) {
            return 0;
        }
        return itemPrice;
    };
    return Campaign;
}());
exports.Campaign = Campaign;
