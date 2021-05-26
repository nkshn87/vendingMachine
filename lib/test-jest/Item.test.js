"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Item_1 = require("../classes/Item");
describe('item', function () {
    describe('constructor', function () {
        it('インスタンスが作成されている', function () {
            var itemName = 'item';
            var oneHundredYen = 100;
            expect(new Item_1.Item(itemName, oneHundredYen)).toBeInstanceOf(Item_1.Item);
        });
        it('パラメーターがクラス変数に設定されている', function () {
            var itemName = 'item';
            var oneHundredYen = 100;
            var item = new Item_1.Item(itemName, oneHundredYen);
            expect(item['name']).toBe(itemName);
            expect(item['price']).toBe(oneHundredYen);
        });
    });
    describe('getName', function () {
        it('nameを取得できる', function () {
            var itemName = 'item';
            var oneHundredYen = 100;
            var item = new Item_1.Item(itemName, oneHundredYen);
            expect(item.getName()).toBe(itemName);
        });
        it('priceを取得できる', function () {
            var itemName = 'item';
            var oneHundredYen = 100;
            var item = new Item_1.Item(itemName, oneHundredYen);
            expect(item.getPrice()).toBe(oneHundredYen);
        });
    });
});
