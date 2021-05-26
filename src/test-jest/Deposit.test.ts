import { Deposit } from '../classes/Deposit';

const zeroYen = 0;
const oneHundredYen = 100;
const twoHundredYen = 200;
const threeHundredYen = 300;

describe('deposit', function () {
    describe('constructor', function () {
        it('インスタンス化されている', function () {
            const deposit = new Deposit();
            expect(deposit).toBeInstanceOf(Deposit);
        });
        it('プロパティーに初期値が設定されている', function () {
            const deposit = new Deposit();
            expect(deposit.showDeposit()).toBe(zeroYen);
        });
    });
    describe('adddeposit', function () {
        it('残金に追加する', function () {
            const deposit = new Deposit();
            deposit.addDeposit(oneHundredYen);
            expect(deposit.showDeposit()).toBe(oneHundredYen);
        });
        it('マイナス値の場合エラーを投げる', function () {
            const minusYen = -100;
            const deposit = new Deposit();
            expect(() => {
                deposit.addDeposit(minusYen);
            }).toThrowError('投入金額が不正です： -100');
        });
        it('0円の場合、正常終了', function () {
            const deposit = new Deposit();
            deposit.addDeposit(zeroYen);
            expect(deposit.showDeposit()).toBe(zeroYen);
        });
    });
    describe('pay', function () {
        //TODO:1/10の確率で正常終了し’free’が返却
        it('引数の数値が残金が以下の場合、残金からパラメータの数値を差し引く', function () {
            const deposit = new Deposit();
            deposit.addDeposit(threeHundredYen);
            deposit.pay(oneHundredYen);
            expect(deposit.showDeposit()).toBe(twoHundredYen);
        });
        it('パラメータの数値が残金より多い場合、エラーを投げる', function () {
            const deposit = new Deposit();
            deposit.addDeposit(oneHundredYen);
            expect(() => {
                deposit.pay(threeHundredYen);
            }).toThrowError('200円足りません');
        });
    });
    describe('payout', function () {
        it('残金をリセットし、払い出した金額を返却', function () {
            const deposit = new Deposit();
            deposit.addDeposit(threeHundredYen);
            expect(deposit.payout()).toBeTruthy();
            expect(deposit.showDeposit()).toBe(zeroYen);
        });
    });
});
