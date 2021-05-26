"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deposit = void 0;
var FormatError_1 = require("../errors/FormatError");
// お金管理装置
var Deposit = /** @class */ (function () {
    function Deposit() {
        this.deposit = 0;
    }
    // 投入金額を格納
    Deposit.prototype.addDeposit = function (payment) {
        if (payment < 0)
            throw new FormatError_1.OrderFormatError('投入金額が不正です： ' + String(payment));
        this.deposit += payment;
        return true;
    };
    // 支払い実行
    Deposit.prototype.pay = function (price) {
        //TODO:入力チェック マイナス
        if (price < 0)
            throw new FormatError_1.OrderFormatError('商品価格が不正です。： ' + String(price));
        var diff = this.deposit - price;
        if (diff < 0)
            throw new FormatError_1.OrderFormatError(String(Math.abs(diff)) + '円足りません。');
        this.deposit -= price;
        return true;
    };
    // お釣りの払い出し
    Deposit.prototype.payout = function () {
        //TODO:deposit返したい resetならわかる
        var deposit = this.deposit;
        this.deposit = 0;
        return deposit;
    };
    // 残金確認 //TODO:getは違和感
    Deposit.prototype.showDeposit = function () {
        return this.deposit;
    };
    return Deposit;
}());
exports.Deposit = Deposit;
