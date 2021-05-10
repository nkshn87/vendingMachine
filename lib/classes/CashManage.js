"use strict";
// お金管理装置
var CashManage = /** @class */ (function () {
    function CashManage() {
        this.deposit = 0;
        this.mode = 'nomal';
    }
    // 投入金額を格納
    CashManage.prototype.addDeposit = function (payment) { this.deposit += payment; };
    ;
    // 支払い実行 モードを返却
    CashManage.prototype.pay = function (price) {
        this.swichMode();
        // 一定確率で全額返金する。
        if (this.mode === 'free') {
            this.mode = 'nomal';
            return 'free';
        }
        var diff = this.deposit - price;
        if (diff < 0)
            throw Math.abs(diff) + "\u5186\u8DB3\u308A\u307E\u305B\u3093\u3002";
        this.deposit -= price;
        return 'nomal';
    };
    // お釣りの払い出し
    CashManage.prototype.payoutChange = function () {
        var change = this.deposit;
        this.deposit = 0;
        return change;
    };
    // 購入可能か判定
    CashManage.prototype.isBuyableState = function (deposit) {
        return deposit <= this.deposit;
    };
    // 預かり金取得
    CashManage.prototype.getDeposit = function () {
        return this.deposit;
    };
    // 一定確率でモードを切り替える
    CashManage.prototype.swichMode = function () {
        if (Math.floor(Math.random() * 10) === 1) {
            this.mode = 'free';
        }
        ;
    };
    return CashManage;
}());
module.exports = new CashManage();
