"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StockManage_1 = __importDefault(require("../src/classes/StockManage"));
var Item_1 = require("../src/classes/Item");
var StockManage_2 = __importDefault(require("../src/classes/StockManage"));
describe('StockManage', function () {
    beforeEach(function () {
        // シングルトンクラスのクラス変数の値をリセット
        StockManage_1.default['itemMap'].clear();
        StockManage_1.default['stockMap'].clear();
        StockManage_1.default['minPrice'] = 0;
    });
    describe('constructor', function () {
        it('シングルトンクラスとしてインスタンスがexportされている', function () {
            expect(StockManage_1.default).toBe(StockManage_2.default); //TODO:シングルトンクラスのテスト確認
        });
    });
    describe('addStock', function () {
        it('取り扱いがない場合新規作成する', function () {
            var itemParam = { name: 'test', price: 100 };
            StockManage_1.default.addStock(itemParam.name, itemParam.price, 3);
            expect(StockManage_1.default['stockMap'].get(StockManage_1.default.getItem(itemParam.name))).toBe(3); // 在庫が追加されている
            expect(StockManage_1.default['itemMap'].size).toBe(1); // itemMapにも登録されている
            expect(StockManage_1.default.getMinPrise()).toBe(itemParam.price); // 最小価格が更新されている
        });
        it('同じ名前の商品が既に存在する場合は、在庫数に追加する', function () {
            var itemParam = { name: 'test', price: 100 };
            StockManage_1.default.addStock(itemParam.name, itemParam.price, 3);
            StockManage_1.default.addStock(itemParam.name, itemParam.price, 3);
            expect(StockManage_1.default['stockMap'].get(StockManage_1.default.getItem(itemParam.name))).toBe(6);
        });
        it('別の名前の商品が既にある存在する場合は、新規作成する', function () {
            var itemParam1 = { name: 'test1', price: 100 };
            var itemParam2 = { name: 'test2', price: 200 };
            StockManage_1.default.addStock(itemParam1.name, itemParam1.price, 3);
            StockManage_1.default.addStock(itemParam2.name, itemParam2.price, 3);
            expect(StockManage_1.default['stockMap'].get(StockManage_1.default.getItem(itemParam2.name))).toBe(3);
            expect(StockManage_1.default['stockMap'].size).toBe(2);
            expect(StockManage_1.default['itemMap'].size).toBe(2);
            expect(StockManage_1.default.getMinPrise()).toBe(itemParam1.price);
        });
        it('在庫追加数が不正の場合はエラーを投げる', function () {
            var itemParam = { name: 'test', price: 100 };
            expect(function () { StockManage_1.default.addStock(itemParam.name, itemParam.price, 0); }).toThrowError('testの追加在庫数の値が不正です。: 0');
        });
        it('在庫追加数が不正の場合はエラーを投げる', function () {
            var itemParam = { name: 'test', price: 100 };
            expect(function () { StockManage_1.default.addStock(itemParam.name, itemParam.price, -1); }).toThrowError('testの追加在庫数の値が不正です。: -1');
        });
    });
    describe('decrementStockMap', function () {
        it('正常パターン。在庫数を１減らす', function () {
            var itemParam = { name: 'test', price: 100 };
            StockManage_1.default.addStock(itemParam.name, itemParam.price, 2);
            var item = StockManage_1.default.getItem(itemParam.name); // 追加した商品インスタンス取得
            StockManage_1.default.decrementStockMap(item);
            expect(StockManage_1.default['stockMap'].get(item)).toBe(1);
        });
        it('正常パターン。最小価格商品の在庫がなくなり最小価格が更新される', function () {
            var itemParam1 = { name: 'test1', price: 100 };
            var itemParam2 = { name: 'test2', price: 200 };
            var itemParam3 = { name: 'test3', price: 300 };
            StockManage_1.default.addStock(itemParam1.name, itemParam1.price, 1);
            StockManage_1.default.addStock(itemParam2.name, itemParam2.price, 1);
            StockManage_1.default.addStock(itemParam3.name, itemParam3.price, 1);
            var item1 = StockManage_1.default.getItem(itemParam1.name); // 追加した商品インスタンス取得
            expect(StockManage_1.default.getMinPrise()).toBe(100); // 最小価格
            StockManage_1.default.decrementStockMap(item1); // 在庫ひとつ減らす
            expect(StockManage_1.default['stockMap'].get(item1)).toBe(0);
            expect(StockManage_1.default.getMinPrise()).toBe(200); // 最小価格更新
        });
        it('在庫数切れの場合エラーを投げる', function () {
            var itemParam = { name: 'test', price: 100 };
            StockManage_1.default.addStock(itemParam.name, itemParam.price, 1);
            var item = StockManage_1.default.getItem(itemParam.name);
            StockManage_1.default.decrementStockMap(item); // 在庫ひとつ減らす
            // 在庫もうひとつ減らすと売り切れ
            expect(function () { StockManage_1.default.decrementStockMap(item); }).toThrowError('testは売り切れです。');
        });
    });
    describe('getItem', function () {
        it('正常パターン。商品のインスタンスを取得', function () {
            var itemParam = { name: 'test', price: 100 };
            StockManage_1.default.addStock(itemParam.name, itemParam.price, 1);
            var item = new Item_1.Item(itemParam.name, itemParam.price);
            expect(JSON.stringify(StockManage_1.default.getItem(itemParam.name))).toBe(JSON.stringify(item)); //TODO:別で生成したインスタンスの比較
        });
        it('取り扱いがない場合、エラーを投げる', function () {
            var itemParam = { name: 'test', price: 100 };
            expect(function () { StockManage_1.default.getItem(itemParam.name); }).toThrowError('testの取り扱いはありません。');
        });
    });
    describe('getMinPrise', function () {
        // その他のメソッドのテストに使用し動作確認
    });
});
