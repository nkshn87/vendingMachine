"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RamdomFreeCampaign = void 0;
var Campaign_1 = require("./Campaign");
var utils_1 = require("../public/libs/utils");
var percentageOfFree = 10;
var RamdomFreeCampaign = /** @class */ (function (_super) {
    __extends(RamdomFreeCampaign, _super);
    function RamdomFreeCampaign() {
        return _super.call(this) || this;
    }
    // 一定確率で全額返金
    RamdomFreeCampaign.prototype.discount = function (itemPrice) {
        var oneHundred = 100;
        if (utils_1.Utils.randomNumFloor(oneHundred / percentageOfFree) === 0) {
            return 0;
        }
        return itemPrice;
    };
    return RamdomFreeCampaign;
}(Campaign_1.Campaign));
exports.RamdomFreeCampaign = RamdomFreeCampaign;
