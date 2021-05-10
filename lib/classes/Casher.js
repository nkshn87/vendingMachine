"use strict";
// お金管理装置
var Casher = /** @class */ (function () {
    function Casher() {
        this.deposit = 0;
        this.mode = 'nomal';
    }
    // 投入金額を格納
    Casher.prototype.addDeposit = function (payment) { this.deposit += payment; };
    ;
    // 支払い実行 モードを返却
    Casher.prototype.pay = function (price) {
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
    Casher.prototype.payoutChange = function () {
        var change = this.deposit;
        this.deposit = 0;
        return change;
    };
    // 購入可能か判定
    Casher.prototype.isBuyableState = function (deposit) {
        return deposit <= this.deposit;
    };
    // 預かり金取得
    Casher.prototype.getDeposit = function () {
        return this.deposit;
    };
    // 一定確率でモードを切り替える
    Casher.prototype.swichMode = function () {
        if (Math.floor(Math.random() * 10) === 1) {
            this.mode = 'free';
        }
        ;
    };
    return Casher;
}());
module.exports = new Casher();
