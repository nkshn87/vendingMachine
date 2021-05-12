"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var Item_1 = require("./Item");
// 在庫管理
var StockManage = /** @class */ (function () {
    function StockManage() {
        this.itemMap = new Map();
        this.stockMap = new Map();
        this.minPrice = 0;
    }
    // 商品の在庫を指定数追加
    StockManage.prototype.addStock = function (name, price, stockNum) {
        // 入力値チェック
        if (!stockNum || stockNum <= 0)
            throw name + "\u306E\u8FFD\u52A0\u5728\u5EAB\u6570\u306E\u5024\u304C\u4E0D\u6B63\u3067\u3059\u3002: " + stockNum;
        // 存在しなければ新規作成
        var item = this.itemMap.get(name);
        if (!item) {
            var inputItem = new Item_1.Item(name, price);
            this.itemMap.set(inputItem.getName(), inputItem);
            this.stockMap.set(inputItem, stockNum);
            if (this.minPrice === 0 || this.minPrice > inputItem.getPrice())
                this.minPrice = inputItem.getPrice();
        }
        else {
            // あれば在庫追加
            var stock = this.stockMap.get(item);
            if (stock === undefined) {
                this.stockMap.set(item, stockNum);
            }
            else {
                this.stockMap.set(item, stock + stockNum);
            }
        }
    };
    // 指定した商品を取得する
    StockManage.prototype.getItem = function (name) {
        var item = this.itemMap.get(name);
        if (item === undefined)
            throw name + "\u306E\u53D6\u308A\u6271\u3044\u306F\u3042\u308A\u307E\u305B\u3093\u3002";
        return item;
    };
    // 商品を１つ取り出し
    StockManage.prototype.decrementStockMap = function (item) {
        var stock = this.stockMap.get(item);
        if (stock === undefined || stock === 0)
            throw item.getName() + "\u306F\u58F2\u308A\u5207\u308C\u3067\u3059\u3002";
        // 在庫ひとつ減らす
        this.stockMap.set(item, stock - 1);
        // 最小価格の更新
        if (stock === 1 && this.minPrice === item.getPrice()) {
            var prices = this.getItemsExistsStock().map(function (item) { return item.getPrice(); });
            if (prices.length === 0) {
                this.minPrice === 0;
                return;
            }
            this.minPrice = prices.reduce(function (price1, price2) { return Math.min(price1, price2); });
        }
    };
    // 在庫のある商品一覧を取得
    StockManage.prototype.getItemsExistsStock = function () {
        var e_1, _a, _b;
        var itemListToString = [];
        var item, stockNum;
        try {
            for (var _c = __values(this.stockMap.entries()), _d = _c.next(); !_d.done; _d = _c.next()) { // イテレータのためmap使えない
                _b = __read(_d.value, 2), item = _b[0], stockNum = _b[1];
                if (stockNum !== 0 && item !== undefined)
                    itemListToString.push(item);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return itemListToString;
    };
    // 商品の最小価格取得
    StockManage.prototype.getMinPrise = function () {
        return this.minPrice;
    };
    return StockManage;
}());
module.exports = new StockManage();
