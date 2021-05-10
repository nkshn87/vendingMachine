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
// 在庫管理
var StockManage = /** @class */ (function () {
    function StockManage() {
        this.itemMap = new Map();
        this.stockMap = new Map();
    }
    // 商品の在庫を指定数追加
    StockManage.prototype.addStock = function (item, stockNum) {
        // 入力値チェック
        if (!stockNum || stockNum <= 0)
            throw item.getName() + "\u306E\u8FFD\u52A0\u5728\u5EAB\u6570\u306E\u5024\u304C\u4E0D\u6B63\u3067\u3059\u3002: " + stockNum;
        // 存在しなければ新規作成
        var stock = this.stockMap.get(item.getName());
        if (!stock) {
            this.itemMap.set(item.getName(), item);
            this.stockMap.set(item.getName(), stockNum);
        }
        else {
            // あれば在庫追加
            this.stockMap.set(item.getName(), stock + stockNum);
        }
    };
    // 商品を１つ取り出し
    StockManage.prototype.takeOutStock = function (itemName) {
        var item = this.itemMap.get(itemName);
        if (item === undefined)
            throw itemName + "\u306E\u53D6\u308A\u6271\u3044\u306F\u3042\u308A\u307E\u305B\u3093\u3002"; // 取り扱いなし
        var stock = this.stockMap.get(item.getName());
        if (stock === undefined || stock === 0)
            throw item.getName() + "\u306F\u58F2\u308A\u5207\u308C\u3067\u3059\u3002"; // 在庫切れ
        this.stockMap.set(item.getName(), stock - 1);
    };
    // 指定した商品の料金を取得
    StockManage.prototype.getPrice = function (itemName) {
        var _a;
        return ((_a = this.itemMap.get(itemName)) === null || _a === void 0 ? void 0 : _a.getPrice()) || 0;
    };
    // 在庫のある商品一覧を取得
    StockManage.prototype.getItems = function () {
        var e_1, _a, _b;
        var itemListToString = [];
        var itemName, stockNum;
        try {
            for (var _c = __values(this.stockMap.entries()), _d = _c.next(); !_d.done; _d = _c.next()) { // イテレータのためmap使えない
                _b = __read(_d.value, 2), itemName = _b[0], stockNum = _b[1];
                var item = this.itemMap.get(itemName);
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
    // 最小価格の商品取得
    StockManage.prototype.getMinPrise = function () {
        var items = this.itemMap.values();
        var item = items.next();
        var minPrice = item.value.price;
        while (!item.done) {
            if (minPrice > item.value.getPrice())
                minPrice = item.value.getPrice();
            item = items.next();
        }
        return minPrice;
    };
    return StockManage;
}());
module.exports = new StockManage();
