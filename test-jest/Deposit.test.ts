import Deposit from '../src/classes/Deposit';
import expectedDeposit from '../src/classes/Deposit';

describe('Deposit', function () {
    beforeEach(() => {
        // シングルトンクラスのクラス変数の値をリセット
            Deposit.payout();
    })

    describe('constructor', function () {
        it('シングルトンクラスとしてインスタンスがexportされている', function () {
            expect(Deposit).toBe(expectedDeposit);//TODO:シングルトンクラスのテスト確認
        });
        it(('プロパティーに初期値が設定されている'), function() {
            expect(Deposit.getDeposit()).toBe(0);
        })
    });
    describe('addDeposit', function () {
        it('残金に追加する', function () {
            Deposit.addDeposit(300);
            expect(Deposit.getDeposit()).toBe(300);
        });
        it('マイナス値の場合エラーを投げる', function () {
            expect(() => {Deposit.addDeposit(-100)}).toThrowError('投入金額が不正です： -100');
        });
        it('0円の場合、正常終了', function () {
            Deposit.addDeposit(0);
            expect(Deposit.getDeposit()).toBe(0);
        });
    });
    describe('pay', function () {//TODO:1/10の確率で正常終了し’free’が返却
        it('パラメータの数値が残金が以下の場合、残金からパラメータの数値を差し引く', function () {
            Deposit.addDeposit(300);
            Deposit.pay(100);
            expect(Deposit.getDeposit()).toBe(200);
        });
        it('パラメータの数値が残金より多い場合、エラーを投げる', function () {
            Deposit.addDeposit(300);
            expect(() => {Deposit.pay(500)}).toThrowError('200円足りません');
        });
    });
    describe('payout', function () {
        it('残金をリセットし、払い出した金額を返却', function () {
            Deposit.addDeposit(300);
            expect(Deposit.payout()).toBeTruthy();
            expect(Deposit.getDeposit()).toBe(0);
        });
    });
});