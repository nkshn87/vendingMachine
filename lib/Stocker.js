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
// 在庫管理
var Stocker = /** @class */ (function () {
    function Stocker() {
        this.itemMap = new Map();
        this.stockMap = new Map();
    }
    // 商品の在庫を指定数追加
    Stocker.prototype.addStock = function (item, stockNum) {
        // 入力値チェック
        if (!stockNum || stockNum <= 0)
            throw item.name + "\u306E\u8FFD\u52A0\u5728\u5EAB\u6570\u306E\u5024\u304C\u4E0D\u6B63\u3067\u3059\u3002: " + stockNum;
        // 存在しなければ新規作成
        var stock = this.stockMap.get(item);
        if (!stock) {
            this.itemMap.set(item.name, item);
            this.stockMap.set(item, stockNum);
        }
        else {
            // あれば在庫追加
            this.stockMap.set(item, stock + stockNum);
        }
    };
    // 商品を１つ取り出し
    Stocker.prototype.takeOutStock = function (itemName) {
        var item = this.itemMap.get(itemName);
        var stock = this.stockMap.get(item);
        if (item === undefined) { // 取り扱いなし
            throw itemName + "\u306E\u53D6\u308A\u6271\u3044\u306F\u3042\u308A\u307E\u305B\u3093\u3002";
        }
        else if (stock === undefined || stock === 0) { // 取り扱いなしまたは、在庫切れ
            throw item.name + "\u306F\u58F2\u308A\u5207\u308C\u3067\u3059\u3002";
        }
        else {
            this.stockMap.set(item, stock - 1);
        }
    };
    // 指定した商品の料金を取得
    Stocker.prototype.getPrice = function (itemName) {
        return this.itemMap.get(itemName).getPrice();
    };
    // 商品一覧を取得
    Stocker.prototype.getItems = function () {
        var e_1, _a;
        var itemListToString = [];
        try {
            for (var _b = __values(this.itemMap.values()), _c = _b.next(); !_c.done; _c = _b.next()) { // イテレータのためmap使えない
                var item = _c.value;
                itemListToString.push(item);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return itemListToString;
    };
    // 最小価格の商品取得
    Stocker.prototype.getMinPrise = function () {
        var items = this.itemMap.values();
        var item = items.next();
        var minPrice = item.value.price;
        while (!item.done) {
            if (minPrice > item.value.price)
                minPrice = item.value.price;
            item = items.next();
        }
        return minPrice;
    };
    return Stocker;
}());
module.exports = new Stocker();
