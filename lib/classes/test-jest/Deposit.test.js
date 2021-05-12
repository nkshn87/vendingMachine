"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Deposit_1 = __importDefault(require("../Deposit"));
var Deposit_2 = __importDefault(require("../Deposit"));
describe('Deposit', function () {
    beforeEach(function () {
        // シングルトンクラスのクラス変数の値をリセット
        Deposit_1.default.payout();
    });
    describe('constructor', function () {
        it('シングルトンクラスとしてインスタンスがexportされている', function () {
            expect(Deposit_1.default).toBe(Deposit_2.default); //TODO:シングルトンクラスのテスト確認
        });
        it(('プロパティーに初期値が設定されている'), function () {
            expect(Deposit_1.default.getDeposit()).toBe(0);
        });
    });
    describe('addDeposit', function () {
        it('残金に追加する', function () {
            Deposit_1.default.addDeposit(300);
            expect(Deposit_1.default.getDeposit()).toBe(300);
        });
        it('マイナス値の場合エラーを投げる', function () {
            expect(function () { Deposit_1.default.addDeposit(-100); }).toThrowError('投入金額が不正です： -100');
        });
        it('0円の場合、正常終了', function () {
            Deposit_1.default.addDeposit(0);
            expect(Deposit_1.default.getDeposit()).toBe(0);
        });
    });
    describe('pay', function () {
        it('パラメータの数値が残金が以下の場合、残金からパラメータの数値を差し引く', function () {
            Deposit_1.default.addDeposit(300);
            Deposit_1.default.pay(100);
            expect(Deposit_1.default.getDeposit()).toBe(200);
        });
        it('パラメータの数値が残金より多い場合、エラーを投げる', function () {
            Deposit_1.default.addDeposit(300);
            expect(function () { Deposit_1.default.pay(500); }).toThrowError('200円足りません');
        });
    });
    describe('payout', function () {
        it('残金をリセットし、払い出した金額を返却', function () {
            Deposit_1.default.addDeposit(300);
            expect(Deposit_1.default.payout()).toBeTruthy();
            expect(Deposit_1.default.getDeposit()).toBe(0);
        });
    });
});
