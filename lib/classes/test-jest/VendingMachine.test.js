"use strict";
//TODO:確率で結果が変わるメソッドのテスト
//TODO:標準入力結果で処理が変わるメソッド
//TODO:console.logされることのテスト
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var VendingMachine_1 = __importDefault(require("../VendingMachine"));
var VendingMachine_2 = __importDefault(require("../VendingMachine"));
var StockManage_1 = __importDefault(require("../StockManage")); //TODO:シングルトンなのでimportすれば、VendingMachineの中で使用しているStockManageを共有できる
var CreateOutputText_1 = __importDefault(require("../CreateOutputText"));
var Deposit_1 = __importDefault(require("../Deposit"));
describe('VendingMachine', function () {
    beforeEach(function () {
        // シングルトンクラスのクラス変数の値をリセット
        StockManage_1.default['itemMap'].clear();
        StockManage_1.default['stockMap'].clear();
        StockManage_1.default['minPrice'] = 0;
        Deposit_1.default.payout();
        CreateOutputText_1.default['textList'] = [];
    });
    describe('constructor', function () {
        it('シングルトンクラスとしてインスタンスがexportされている', function () {
            expect(VendingMachine_1.default).toBe(VendingMachine_2.default); //TODO:シングルトンクラスなので同じ
            // expect(new Item('a', 1)).toBe(new Item('a', 1)) //通常インスタンス化の場合、別物と判定される
        });
    });
    describe('showItems', function () {
        it('正常パターン。在庫のある商品のみを標準出力する', function () {
            StockManage_1.default.addStock('test1', 100, 1);
            StockManage_1.default.addStock('test2', 100, 1);
            StockManage_1.default.addStock('test3', 100, 1);
            StockManage_1.default.decrementStockMap(StockManage_1.default.getItem('test3')); // 在庫なし
            console.log = jest.fn();
            VendingMachine_1.default.showItems();
            var text = '商品一覧です （商品名：投入金額）\n';
            text += 'test1: 100円\ntest2: 100円'; //TODO:privateメソッドのテスト
            text += '\n\nご注文内容を入力してください。※ 購入を止める場合は「n」と入力', '商品名：投入金額(単位なし)';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText_1.default.outputText(text));
        });
        it('正常パターン。残金が0円ではない場合、残金以下の価格の商品を標準出力する', function () {
            Deposit_1.default.addDeposit(100);
            StockManage_1.default.addStock('test1', 100, 1);
            StockManage_1.default.addStock('test2', 200, 1); // 残高以上
            console.log = jest.fn();
            VendingMachine_1.default.showItems();
            var text = '商品一覧です （商品名：投入金額）\n';
            text += 'test1: 100円';
            text += '\n\nご注文内容を入力してください。※ 購入を止める場合は「n」と入力', '商品名：投入金額(単位なし)';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText_1.default.outputText(text));
        });
    });
    describe('buy', function () {
        it('フォーマットエラーの場合、メッセージを標準出力しtrueを返却', function () {
            StockManage_1.default.addStock('test1', 100, 1);
            StockManage_1.default.addStock('test2', 200, 1);
            console.log = jest.fn();
            expect(VendingMachine_1.default.buy('testtext')).toBeTruthy();
            var text = '入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText_1.default.outputText(text));
        });
        it('フォーマットエラーの場合、メッセージを標準出力しtrueを返却', function () {
            StockManage_1.default.addStock('test1', 100, 1);
            StockManage_1.default.addStock('test2', 200, 1);
            console.log = jest.fn();
            expect(VendingMachine_1.default.buy('test1:test1')).toBeTruthy();
            var text = '入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText_1.default.outputText(text));
        });
        it('正常パターン（残金で追加購入不可）。在庫を一つ減らす：お釣り払い出し：メッセージを標準出力：Falseを返却', function () {
            var ordertext = 'test1:150';
            StockManage_1.default.addStock('test1', 100, 2);
            console.log = jest.fn();
            expect(VendingMachine_1.default.buy(ordertext)).toBeFalsy();
            expect(StockManage_1.default['stockMap'].get(StockManage_1.default.getItem('test1'))).toBe(1);
            var text = 'test1が買えました。現在の預かり金は50円です。\n\n毎度ありがとうございました。お釣り50円を返金します。';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText_1.default.outputText(text));
        });
        it('正常パターン（残金で追加購入可能）。在庫を一つ減らす：お釣り払い出しなし：メッセージをCreateOutputTextのtextListに格納：Trueを返却', function () {
            var ordertext = 'test1:500';
            StockManage_1.default.addStock('test1', 100, 2);
            expect(VendingMachine_1.default.buy(ordertext)).toBeTruthy();
            expect(StockManage_1.default['stockMap'].get(StockManage_1.default.getItem('test1'))).toBe(1);
            expect(Deposit_1.default.getDeposit()).toBe(400); // お釣り払い出しなし
            var expectList = ["test1\u304C\u8CB7\u3048\u307E\u3057\u305F\u3002\u73FE\u5728\u306E\u9810\u304B\u308A\u91D1\u306F400\u5186\u3067\u3059\u3002"];
            expect(CreateOutputText_1.default['textList']).toEqual(expectList);
        });
        it('在庫がないかつ残金で追加購入可能な場合。在庫変化なし：お釣り払い出しなし：メッセージをCreateOutputTextのtextListに格納：Trueを返却', function () {
            var ordertext = 'test1:100';
            StockManage_1.default.addStock('test1', 100, 1);
            StockManage_1.default.decrementStockMap(StockManage_1.default.getItem('test1')); // 在庫を0に
            expect(VendingMachine_1.default.buy(ordertext)).toBeTruthy();
            expect(StockManage_1.default['stockMap'].get(StockManage_1.default.getItem('test1'))).toBe(0); // 在庫変化なし
            expect(Deposit_1.default.getDeposit()).toBe(100); // お釣り払い出しなし
            var expectList = ["test1\u306F\u58F2\u308A\u5207\u308C\u3067\u3059\u3002\u73FE\u5728\u306E\u9810\u304B\u308A\u91D1\u306F100\u5186\u3067\u3059\u3002"];
            expect(CreateOutputText_1.default['textList']).toEqual(expectList);
        });
        it('投入金額が商品の価格を下回る場合、在庫変化なし：お釣り払い出し：メッセージをメッセージをCreateOutputTextのtextListに格納：Falseを返却', function () {
            var ordertext = 'test:50';
            StockManage_1.default.addStock('test', 100, 1);
            console.log = jest.fn();
            expect(VendingMachine_1.default.buy(ordertext)).toBeFalsy();
            expect(StockManage_1.default['stockMap'].get(StockManage_1.default.getItem('test'))).toBe(1); // 在庫変化なし
            expect(Deposit_1.default.getDeposit()).toBe(0); // お釣り払い出し済
            var text = '50円足りません。現在の預かり金は50円です。\n\n毎度ありがとうございました。お釣り50円を返金します。';
            expect(console.log).toHaveBeenCalledWith(CreateOutputText_1.default.outputText(text));
        });
        // 在庫がないかつ残金で追加購入不可能な場合　=> 購入不可能な残金でbuyが呼ばれることはない
    });
    describe('addStock', function () {
        it('正常パターン：商品の在庫に追加する', function () {
            VendingMachine_1.default.addStock('test1', 100, 1);
            expect(StockManage_1.default.getItem('test1').getName()).toBe('test1');
        });
        it('異常パターン：追加在庫数不正はエラーを投げる', function () {
            expect(function () { VendingMachine_1.default.addStock('test1', 100, -1); }).toThrowError('test1の追加在庫数の値が不正です。: -1');
        });
    });
    describe('showDisplay', function () {
        it('ラップして標準出力する', function () {
            VendingMachine_1.default.addStock('test1', 100, 1);
            console.log = jest.fn();
            var text = 'test';
            VendingMachine_1.default['showDisplay'](text); //TODO:privateメソッドの実行
            expect(console.log).toHaveBeenCalledWith(CreateOutputText_1.default.outputText(text));
        });
    });
});
