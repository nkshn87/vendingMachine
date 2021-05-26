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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockManage = void 0;
var FormatError_1 = require("../errors/FormatError");
var Item_1 = require("./Item");
// 在庫管理
var StockManage = /** @class */ (function () {
    function StockManage() {
        this.stockMap = new Map();
    }
    // 商品の在庫を指定数追加
    StockManage.prototype.addStock = function (name, price, stockNum) {
        // 入力値チェック
        if (stockNum <= 0) {
            throw new FormatError_1.FormatError(name + 'の追加在庫数の値が不正です。: ' + String(stockNum));
        }
        // 商品の取り扱い確認（過去にstockMapに追加されたことがあるか）
        var item = this.getItem(name);
        // 取り扱いがない場合、新規作成
        if (item === undefined) {
            var inputItem = new Item_1.Item(name, price);
            this.stockMap.set(inputItem, stockNum);
            return true;
            // 既に取り扱いがある場合、在庫数を追加
        }
        else {
            var stock = this.stockMap.get(item);
            if (stock !== undefined)
                this.stockMap.set(item, stock + stockNum);
            // 取り扱い確認が完了しているため、stockがundefinedになることはない
            return true;
        }
    };
    // 指定した商品を取得する
    StockManage.prototype.getItem = function (name) {
        var e_1, _a;
        try {
            for (var _b = __values(this.stockMap.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.getName() === name)
                    return item;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return undefined;
    };
    // 商品を１つ取り出し
    StockManage.prototype.decrementStockMap = function (item) {
        var stock = this.stockMap.get(item);
        if (stock === undefined || stock === 0)
            throw new Error(item.getName() + 'は売り切れです。');
        // 在庫ひとつ減らす
        this.stockMap.set(item, stock - 1);
        return true;
    };
    // 在庫のある商品一覧を取得
    StockManage.prototype.getItemsInStock = function () {
        var e_2, _a;
        var itemList = []; //TODO:これいらない
        try {
            for (var _b = __values(this.stockMap.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), item = _d[0], stockNum = _d[1];
                //TODO:１行で書ける
                if (stockNum !== 0)
                    itemList.push(item);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return itemList;
    };
    // 商品の最小価格取得
    StockManage.prototype.getMinPrise = function () {
        //TODO:loopを減らす
        var minPrice; //TODO:なしでできる
        this.getItemsInStock().forEach(function (item) {
            if (minPrice === undefined || minPrice > item.getPrice())
                minPrice = item.getPrice();
        });
        if (minPrice === undefined)
            return 0;
        return minPrice;
    };
    return StockManage;
}());
exports.StockManage = StockManage;
