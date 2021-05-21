import StockManage from '../src/classes/StockManage';
import {Item} from '../src/classes/Item';
import expectedStockManage from '../src/classes/StockManage';

describe('StockManage', function () {
    beforeEach(() => {
        // シングルトンクラスのクラス変数の値をリセット
            StockManage['itemMap'].clear();
            StockManage['stockMap'].clear();
            StockManage['minPrice'] = 0;
    })

    describe('constructor', function () {
        it('シングルトンクラスとしてインスタンスがexportされている', function () {
            expect(StockManage).toBe(expectedStockManage);//TODO:シングルトンクラスのテスト確認
        });
    });
    describe('addStock', function () {
        it('取り扱いがない場合新規作成する', function () {
            const itemParam = {name: 'test', price:100}
            StockManage.addStock(itemParam.name, itemParam.price, 3);

            expect(StockManage['stockMap'].get(StockManage.getItem(itemParam.name))).toBe(3); // 在庫が追加されている
            expect(StockManage['itemMap'].size).toBe(1);　// itemMapにも登録されている
            expect(StockManage.getMinPrise()).toBe(itemParam.price); // 最小価格が更新されている
        });
        it('同じ名前の商品が既に存在する場合は、在庫数に追加する', function () {
            const itemParam = {name: 'test', price:100}
            StockManage.addStock(itemParam.name, itemParam.price, 3);
            StockManage.addStock(itemParam.name, itemParam.price, 3);

            expect(StockManage['stockMap'].get(StockManage.getItem(itemParam.name))).toBe(6);
        });
        it('別の名前の商品が既にある存在する場合は、新規作成する', function () {
            const itemParam1 = {name: 'test1', price:100}
            const itemParam2 = {name: 'test2', price:200}
            StockManage.addStock(itemParam1.name, itemParam1.price, 3);
            StockManage.addStock(itemParam2.name, itemParam2.price, 3);
            expect(StockManage['stockMap'].get(StockManage.getItem(itemParam2.name))).toBe(3);
            expect(StockManage['stockMap'].size).toBe(2);
            expect(StockManage['itemMap'].size).toBe(2);
            expect(StockManage.getMinPrise()).toBe(itemParam1.price);
        });
        it('在庫追加数が不正の場合はエラーを投げる', function () {
            const itemParam = {name: 'test', price:100}
            expect(() => {StockManage.addStock(itemParam.name, itemParam.price, 0)}).toThrowError('testの追加在庫数の値が不正です。: 0');
        });
        it('在庫追加数が不正の場合はエラーを投げる', function () {
            const itemParam = {name: 'test', price:100}
            expect(() => {StockManage.addStock(itemParam.name, itemParam.price, -1)}).toThrowError('testの追加在庫数の値が不正です。: -1');
        });
    });
    describe('decrementStockMap', function () {
        it('正常パターン。在庫数を１減らす', function () {
            const itemParam = {name: 'test', price:100};
            StockManage.addStock(itemParam.name, itemParam.price, 2);
            const item = StockManage.getItem(itemParam.name);　// 追加した商品インスタンス取得
            StockManage.decrementStockMap(item);
            expect(StockManage['stockMap'].get(item)).toBe(1);
        });
        it('正常パターン。最小価格商品の在庫がなくなり最小価格が更新される', function () {
            const itemParam1 = {name: 'test1', price:100};
            const itemParam2 = {name: 'test2', price:200};
            const itemParam3 = {name: 'test3', price:300};
            StockManage.addStock(itemParam1.name, itemParam1.price, 1);
            StockManage.addStock(itemParam2.name, itemParam2.price, 1);
            StockManage.addStock(itemParam3.name, itemParam3.price, 1);
            const item1 = StockManage.getItem(itemParam1.name); // 追加した商品インスタンス取得
            expect(StockManage.getMinPrise()).toBe(100);　// 最小価格
            StockManage.decrementStockMap(item1); // 在庫ひとつ減らす
            expect(StockManage['stockMap'].get(item1)).toBe(0);
            expect(StockManage.getMinPrise()).toBe(200);　 // 最小価格更新
        });
        it('在庫数切れの場合エラーを投げる', function () {
            const itemParam = {name: 'test', price:100};
            StockManage.addStock(itemParam.name, itemParam.price, 1);
            const item = StockManage.getItem(itemParam.name);
            StockManage.decrementStockMap(item); // 在庫ひとつ減らす
            // 在庫もうひとつ減らすと売り切れ
            expect(() => {StockManage.decrementStockMap(item);}).toThrowError('testは売り切れです。');
        });
    });
    describe('getItem', function () {
        it('正常パターン。商品のインスタンスを取得', function () {
            const itemParam = {name: 'test', price: 100};
            StockManage.addStock(itemParam.name, itemParam.price, 1);
            const item = new Item(itemParam.name, itemParam.price);
            expect(JSON.stringify(StockManage.getItem(itemParam.name))).toBe(JSON.stringify(item)); //TODO:別で生成したインスタンスの比較
        });
        it('取り扱いがない場合、エラーを投げる', function () {
            const itemParam = {name: 'test', price: 100};
            expect(() => {StockManage.getItem(itemParam.name)}).toThrowError('testの取り扱いはありません。');
        });
    });
    describe('getMinPrise', function () {
        // その他のメソッドのテストに使用し動作確認
    });

});