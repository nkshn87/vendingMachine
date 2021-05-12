//TODO:確率で結果が変わるメソッドのテスト
//TODO:標準入力結果で処理が変わるメソッド
//TODO:console.logされることのテスト

import VendingMachine from '../VendingMachine';
import {Item} from '../Item';
import expectedVendingMachine from '../VendingMachine';
import StockManage from '../StockManage'; //TODO:シングルトンなのでimportすれば、VendingMachineの中で使用しているStockManageを共有できる
import CreateOutputText from '../CreateOutputText';
import Deposit from '../Deposit';

describe('VendingMachine', function () {

    beforeEach(() => {
        // シングルトンクラスのクラス変数の値をリセット
            StockManage['itemMap'].clear();
            StockManage['stockMap'].clear()
            StockManage['minPrice'] = 0;
            Deposit.payout();
            CreateOutputText['textList'] = [];
    })
    describe('constructor', function () {
        it('シングルトンクラスとしてインスタンスがexportされている', function () {
            expect(VendingMachine).toBe(expectedVendingMachine);//TODO:シングルトンクラスなので同じ
            // expect(new Item('a', 1)).toBe(new Item('a', 1)) //通常インスタンス化の場合、別物と判定される
        });
    });
    describe('showItems', function () {
        it('正常パターン。在庫のある商品のみを標準出力する', function () {
            StockManage.addStock('test1', 100, 1);
            StockManage.addStock('test2', 100, 1);
            StockManage.addStock('test3', 100, 1);
            StockManage.decrementStockMap(StockManage.getItem('test3')); // 在庫なし
            console.log = jest.fn();
            VendingMachine.showItems();
            let text = '商品一覧です （商品名：投入金額）\n';
            text += 'test1: 100円\ntest2: 100円'; //TODO:privateメソッドのテスト
            text += '\n\nご注文内容を入力してください。※ 購入を止める場合は「n」と入力', '商品名：投入金額(単位なし)';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText.outputText(text));
        });
        it('正常パターン。残金が0円ではない場合、残金以下の価格の商品を標準出力する', function () {
            Deposit.addDeposit(100);
            StockManage.addStock('test1', 100, 1);
            StockManage.addStock('test2', 200, 1); // 残高以上
            console.log = jest.fn();
            VendingMachine.showItems();
            let text = '商品一覧です （商品名：投入金額）\n';
            text += 'test1: 100円';
            text += '\n\nご注文内容を入力してください。※ 購入を止める場合は「n」と入力', '商品名：投入金額(単位なし)';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText.outputText(text));
        });
    });
    describe('buy', function () {
        it('フォーマットエラーの場合、メッセージを標準出力しtrueを返却', function () {
            StockManage.addStock('test1', 100, 1);
            StockManage.addStock('test2', 200, 1);
            console.log = jest.fn();
            expect(VendingMachine.buy('testtext')).toBeTruthy();
            let text = '入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText.outputText(text));
        });
        it('フォーマットエラーの場合、メッセージを標準出力しtrueを返却', function () {
            StockManage.addStock('test1', 100, 1);
            StockManage.addStock('test2', 200, 1);
            console.log = jest.fn();
            expect(VendingMachine.buy('test1:test1')).toBeTruthy();
            let text = '入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText.outputText(text));
        });
        it('正常パターン（残金で追加購入不可）。在庫を一つ減らす：お釣り払い出し：メッセージを標準出力：Falseを返却', function () {
            const ordertext = 'test1:150';
            StockManage.addStock('test1', 100, 2);
            console.log = jest.fn();
            expect(VendingMachine.buy(ordertext)).toBeFalsy();
            expect(StockManage['stockMap'].get(StockManage.getItem('test1'))).toBe(1);
            let text = 'test1が買えました。現在の預かり金は50円です。\n\n毎度ありがとうございました。お釣り50円を返金します。';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText.outputText(text));
        });
        it('正常パターン（残金で追加購入可能）。在庫を一つ減らす：お釣り払い出しなし：メッセージをCreateOutputTextのtextListに格納：Trueを返却', function () {
            const ordertext = 'test1:500';
            StockManage.addStock('test1', 100, 2);
            expect(VendingMachine.buy(ordertext)).toBeTruthy();
            expect(StockManage['stockMap'].get(StockManage.getItem('test1'))).toBe(1);
            expect(Deposit.getDeposit()).toBe(400); // お釣り払い出しなし
            let expectList = [`test1が買えました。現在の預かり金は400円です。`];
            expect(CreateOutputText['textList']).toEqual(expectList);
        });
        it('在庫がないかつ残金で追加購入可能な場合。在庫変化なし：お釣り払い出しなし：メッセージをCreateOutputTextのtextListに格納：Trueを返却', function () {
            const ordertext = 'test1:100';
            StockManage.addStock('test1', 100, 1);
            StockManage.decrementStockMap(StockManage.getItem('test1')); // 在庫を0に
            expect(VendingMachine.buy(ordertext)).toBeTruthy();
            expect(StockManage['stockMap'].get(StockManage.getItem('test1'))).toBe(0); // 在庫変化なし
            expect(Deposit.getDeposit()).toBe(100); // お釣り払い出しなし
            let expectList = [`test1は売り切れです。現在の預かり金は100円です。`];
            expect(CreateOutputText['textList']).toEqual(expectList);
        });
        it('投入金額が商品の価格を下回る場合、在庫変化なし：お釣り払い出し：メッセージをメッセージをCreateOutputTextのtextListに格納：Falseを返却', function () {
            const ordertext = 'test:50';
            StockManage.addStock('test', 100, 1);

            console.log = jest.fn();
            expect(VendingMachine.buy(ordertext)).toBeFalsy();
            expect(StockManage['stockMap'].get(StockManage.getItem('test'))).toBe(1); // 在庫変化なし
            expect(Deposit.getDeposit()).toBe(0); // お釣り払い出し済
            let text = '50円足りません。現在の預かり金は50円です。\n\n毎度ありがとうございました。お釣り50円を返金します。';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText.outputText(text));
        });
        // 在庫がないかつ残金で追加購入不可能な場合　=> 購入不可能な残金でbuyが呼ばれることはない
    });
    describe('addStock', function () {
        it('正常パターン：商品の在庫に追加する', function () {
            VendingMachine.addStock('test1', 100, 1);
            expect(StockManage.getItem('test1').getName()).toBe('test1');
        });
        it('異常パターン：追加在庫数不正はエラーを投げる', function () {
            expect(() => {VendingMachine.addStock('test1', 100, -1)}).toThrowError('test1の追加在庫数の値が不正です。: -1');
        });
    });
    describe('showDisplay', function () {
        it('ラップして標準出力する', function () {
            VendingMachine.addStock('test1', 100, 1);
            console.log = jest.fn();
            const text = 'test'
            VendingMachine['showDisplay'](text); //TODO:privateメソッドの実行
            expect(console.log).toHaveBeenCalledWith(CreateOutputText.outputText(text));
        });
    });
});