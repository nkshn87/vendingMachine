"use strict";
// お金管理装置
var Deposit = /** @class */ (function () {
    function Deposit() {
        this.deposit = 0;
    }
    // 投入金額を格納
    Deposit.prototype.addDeposit = function (payment) {
        if (payment < 0)
            throw "\u6295\u5165\u91D1\u984D\u304C\u4E0D\u6B63\u3067\u3059\uFF1A " + payment + "\u3002";
        this.deposit += payment;
        return true;
    };
    // 支払い実行
    Deposit.prototype.pay = function (price) {
        var diff = this.deposit - price;
        if (diff < 0)
            throw Math.abs(diff) + "\u5186\u8DB3\u308A\u307E\u305B\u3093\u3002";
        this.deposit -= price;
        return true;
    };
    // お釣りの払い出し
    Deposit.prototype.payout = function () {
        this.deposit = 0;
        return true;
    };
    // 残金取得
    Deposit.prototype.getDeposit = function () {
        return this.deposit;
    };
    return Deposit;
}());
module.exports = new Deposit();
