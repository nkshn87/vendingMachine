"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var OperationDisplay = require('./OperationDisplay');
var Stocker = require('./Stocker');
var Casher = require('./Casher');
// TODO : calss private public リンター厳しいのいれる リストアップ
// 自動販売機
var VendingMachine = /** @class */ (function () {
    function VendingMachine() {
    }
    // 商品一覧を表示する
    VendingMachine.prototype.showItems = function () {
        // 商品リスト取得
        var showItemList = Stocker.getItems();
        // 既に預かり金が存在する場合、残金で購入できる商品リストに絞る
        if (Casher.getDeposit() !== 0)
            showItemList = this.getCanBuyItems(showItemList);
        // 商品情報を文字列にして結合
        var text = '商品一覧です （商品名：投入金額）\n';
        text += showItemList.map(function (item) { return item.name + ": " + item.price + "\u5186"; }).join('\n');
        OperationDisplay.showDisplayWithWrapping(text, 'start');
    };
    // 残金で購入できる商品一覧取得
    VendingMachine.prototype.getCanBuyItems = function (items) {
        return items.filter(function (item) { return item.price <= Casher.getDeposit(); });
    };
    // 注文を受ける
    VendingMachine.prototype.order = function () {
        return __awaiter(this, void 0, void 0, function () {
            var order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: //TODO:asyncと戻り値の書き方もっかいテスト
                    return [4 /*yield*/, OperationDisplay.questionWithFormatCheck('ご注文内容を入力してください', '商品名：投入金額(単位なし)', OperationDisplay.isNotMatchOrderFormat)];
                    case 1:
                        _a.sent();
                        order = OperationDisplay.getOrder();
                        Casher.addDeposit(order.payment); // 料金投入
                        return [2 /*return*/, order];
                }
            });
        });
    };
    // 購入
    VendingMachine.prototype.buy = function (order) {
        try {
            // 在庫をひとつ減らす
            Stocker.takeOutStock(order.itemName);
            // 預かり金から購入金額を差し引く
            if (Casher.pay(Stocker.getPrice(order.itemName)) === 'free') {
                return "\u304A\u3081\u3067\u3068\u3046\u3054\u3056\u3044\u307E\u3059\uFF01" + order.itemName + "\u3092\u7121\u6599\u3067\u30D7\u30EC\u30BC\u30F3\u30C8\u3057\u307E\u3059\uFF01";
            }
            ;
            return order.itemName + "\u304C\u8CB7\u3048\u307E\u3057\u305F\u3002\u73FE\u5728\u306E\u9810\u304B\u308A\u91D1\u306F" + Casher.getDeposit() + "\u5186\u3067\u3059";
        }
        catch (err) {
            throw "" + err + Casher.payoutChange() + "\u5186\u8FD4\u91D1\u3057\u307E\u3059\u3002";
        }
    };
    // 画面に表示する
    VendingMachine.prototype.showDisplay = function (text, type) {
        OperationDisplay.showDisplayWithWrapping(text, type);
    };
    // 商品を補充する
    VendingMachine.prototype.addStocker = function (item, stockNum) {
        try {
            Stocker.addStock(item, stockNum);
        }
        catch (err) {
            throw err.message;
        }
    };
    // 残金で購入できるか判定する
    VendingMachine.prototype.isBuyableState = function () {
        var minPrice = Stocker.getMinPrise();
        return Casher.isBuyableState(minPrice);
    };
    // 追加購入するかユーザーに確認する
    VendingMachine.prototype.confirmWhetherBuy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, OperationDisplay.questionWithFormatCheck('残金で追加購入可能な商品があります。購入しますか？', '[y/n]', OperationDisplay.isNotMatchYesNoFormat)];
                    case 1:
                        reaction = _a.sent();
                        reaction = reaction.toLowerCase();
                        if (reaction === 'y')
                            return [2 /*return*/, true];
                        return [2 /*return*/, false];
                }
            });
        });
    };
    // お釣りを払い出す
    VendingMachine.prototype.payoutChange = function () {
        return "\u6BCE\u5EA6\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3057\u305F\u3002\u304A\u91E3\u308A" + Casher.payoutChange() + "\u5186\u3092\u8FD4\u91D1\u3057\u307E\u3059\u3002";
    };
    return VendingMachine;
}());
module.exports = new VendingMachine();
