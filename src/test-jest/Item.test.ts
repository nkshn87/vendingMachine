import { Item } from '../classes/Item';

describe('item', function () {
    describe('constructor', function () {
        it('インスタンスが作成されている', function () {
            const itemName = 'item';
            const oneHundredYen = 100;
            expect(new Item(itemName, oneHundredYen)).toBeInstanceOf(Item);
        });
        it('パラメーターがクラス変数に設定されている', function () {
            const itemName = 'item';
            const oneHundredYen = 100;
            const item = new Item(itemName, oneHundredYen);
            expect(item['name']).toBe(itemName);
            expect(item['price']).toBe(oneHundredYen);
        });
    });
    describe('getName', function () {
        it('nameを取得できる', function () {
            const itemName = 'item';
            const oneHundredYen = 100;
            const item = new Item(itemName, oneHundredYen);
            expect(item.getName()).toBe(itemName);
        });
        it('priceを取得できる', function () {
            const itemName = 'item';
            const oneHundredYen = 100;
            const item = new Item(itemName, oneHundredYen);
            expect(item.getPrice()).toBe(oneHundredYen);
        });
    });
});
