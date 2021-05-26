/* eslint @typescript-eslint/no-non-null-assertion: off */
import { StockManage } from '../classes/StockManage';
import { Item } from '../classes/Item';

const zeroStock = 0;
const minusStock = -1;
const twoStock = 2;
const threeStock = 3;
const sixStock = 6;
const oneHundredYen = 100;
const twoHundredYen = 200;

describe('StockManage', function () {
    describe('constructor', function () {
        it('インスタンス化されている', function () {
            const stockManage = new StockManage();
            expect(stockManage).toBeInstanceOf(StockManage);
        });
    });
    describe('addStock', function () {
        it('取り扱いがない場合新規作成する', function () {
            const itemParam = { name: 'test', price: 100 };
            const stockManage = new StockManage();
            stockManage.addStock(itemParam.name, itemParam.price, threeStock);

            expect(stockManage['stockMap'].get(stockManage.getItem(itemParam.name)!)).toBe(threeStock); // 在庫が追加されている
            expect(stockManage.getMinPrise()).toBe(itemParam.price); // 最小価格が更新されている
        });
        it('同じ名前の商品が既に存在する場合は、在庫数に追加する', function () {
            const itemParam = { name: 'test', price: 100 };
            const stockManage = new StockManage();
            stockManage.addStock(itemParam.name, itemParam.price, threeStock);
            stockManage.addStock(itemParam.name, itemParam.price, threeStock);

            expect(stockManage['stockMap'].get(stockManage.getItem(itemParam.name)!)).toBe(sixStock);
        });
        it('別の名前の商品が既にある存在する場合は、新規作成する', function () {
            const itemParam1 = { name: 'test1', price: 100 };
            const itemParam2 = { name: 'test2', price: 200 };
            const stockManage = new StockManage();
            stockManage.addStock(itemParam1.name, itemParam1.price, threeStock);
            stockManage.addStock(itemParam2.name, itemParam2.price, threeStock);
            expect(stockManage['stockMap'].get(stockManage.getItem(itemParam2.name)!)).toBe(threeStock);
            expect(stockManage['stockMap'].size).toBe(twoStock);
            expect(stockManage.getMinPrise()).toBe(itemParam1.price);
        });
        it('在庫追加数が不正(0個)の場合はエラーを投げる', function () {
            const itemParam = { name: 'test', price: 100 };
            const stockManage = new StockManage();
            expect(() => {
                stockManage.addStock(itemParam.name, itemParam.price, zeroStock);
            }).toThrowError('testの追加在庫数の値が不正です。: 0');
        });
        it('在庫追加数が不正(負数)の場合はエラーを投げる', function () {
            const itemParam = { name: 'test', price: 100 };
            const stockManage = new StockManage();
            expect(() => {
                stockManage.addStock(itemParam.name, itemParam.price, minusStock);
            }).toThrowError('testの追加在庫数の値が不正です。: -1');
        });
    });
    describe('decrementStockMap', function () {
        it('正常パターン。在庫数を１減らす', function () {
            const itemParam = { name: 'test', price: 100 };
            const stockManage = new StockManage();
            stockManage.addStock(itemParam.name, itemParam.price, twoStock);
            const item = stockManage.getItem(itemParam.name)!; // 追加した商品インスタンス取得
            stockManage.decrementStockMap(item);
            expect(stockManage['stockMap'].get(item)).toBe(1);
        });
        it('正常パターン。最小価格商品の在庫がなくなり最小価格が更新される', function () {
            const itemParam1 = { name: 'test1', price: 100 };
            const itemParam2 = { name: 'test2', price: 200 };
            const itemParam3 = { name: 'test3', price: 300 };
            const stockManage = new StockManage();
            stockManage.addStock(itemParam1.name, itemParam1.price, 1);
            stockManage.addStock(itemParam2.name, itemParam2.price, 1);
            stockManage.addStock(itemParam3.name, itemParam3.price, 1);
            const item1 = stockManage.getItem(itemParam1.name)!; // 追加した商品インスタンス取得
            expect(stockManage.getMinPrise()).toBe(oneHundredYen); // 最小価格
            stockManage.decrementStockMap(item1); // 在庫ひとつ減らす
            expect(stockManage['stockMap'].get(item1)).toBe(zeroStock);
            expect(stockManage.getMinPrise()).toBe(twoHundredYen); // 最小価格更新
        });
        it('在庫数切れの場合エラーを投げる', function () {
            const itemParam = { name: 'test', price: 100 };
            const stockManage = new StockManage();
            stockManage.addStock(itemParam.name, itemParam.price, 1);
            const item = stockManage.getItem(itemParam.name)!;
            stockManage.decrementStockMap(item); // 在庫ひとつ減らす
            // 在庫もうひとつ減らすと売り切れ
            expect(() => {
                stockManage.decrementStockMap(item);
            }).toThrowError('testは売り切れです。');
        });
    });
    describe('getItem', function () {
        it('正常パターン。商品のインスタンスを取得', function () {
            const itemParam = { name: 'test', price: 100 };
            const stockManage = new StockManage();
            stockManage.addStock(itemParam.name, itemParam.price, 1);
            const item = new Item(itemParam.name, itemParam.price);
            expect(JSON.stringify(stockManage.getItem(itemParam.name))).toBe(JSON.stringify(item)); //NOTE:別々で生成したインスタンスの中身の比較
        });
        it('取り扱いがない場合、undefined', function () {
            const itemParam = { name: 'test', price: 100 };
            const stockManage = new StockManage();
            expect(stockManage.getItem(itemParam.name)).toBeUndefined();
        });
    });
    describe('getMinPrise', function () {
        // その他のメソッドのテストに使用し動作確認
    });
});
