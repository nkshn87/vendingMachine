"use strict";
// const Wrap = require('./Wrap');
// const Stocker = require('./Stocker');
// const Casher = require('./Casher');
// const utils = require('../public/libs/utils');
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Wrap_1 = __importDefault(require("./Wrap"));
var StockManage_1 = __importDefault(require("./StockManage"));
var CashManage_1 = __importDefault(require("./CashManage"));
var utils_1 = __importDefault(require("../public/libs/utils"));
var eol = require('os').EOL; //改行コード
// import readline from 'readline-promise';
// import eol from 'os';
// TODO : calss private public リンター厳しいのいれる リストアップ
// 自動販売機
var VendingMachine = /** @class */ (function () {
    function VendingMachine() {
        this.elementNum = 2; // 注文に必要な要素数
        this.inputItemName = '';
        this.inputPayment = 0;
    }
    // 注文を受ける
    VendingMachine.prototype.order = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reaction, order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.showItems();
                        return [4 /*yield*/, this.questionWithFormatCheck('ご注文内容を入力してください。※ 購入を止める場合は「n」と入力', '商品名：投入金額(単位なし)', this.isMatchOrderFormat)];
                    case 1:
                        reaction = _a.sent();
                        if (reaction === 'n')
                            return [2 /*return*/, null];
                        order = { itemName: this.inputItemName, payment: this.inputPayment };
                        CashManage_1.default.addDeposit(order.payment); // 料金投入
                        return [2 /*return*/, order];
                }
            });
        });
    };
    // 購入処理
    VendingMachine.prototype.buyFacade = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (order !== null) {
                    // 購入
                    this.showDisplay(this.buy(order), 'standby');
                    //  追加購入可能な状態か判定
                    if (this.isBuyableState())
                        return [2 /*return*/, true];
                }
                // お釣りの払い出し
                this.showDisplay(this.payoutChange());
                return [2 /*return*/, false];
            });
        });
    };
    // 商品を補充する
    VendingMachine.prototype.addStocker = function (item, stockNum) {
        try {
            StockManage_1.default.addStock(item, stockNum);
        }
        catch (err) {
            throw err;
        }
    };
    /**
     * purivate method
     */
    // 購入
    VendingMachine.prototype.buy = function (order) {
        try {
            // 在庫をひとつ減らす
            StockManage_1.default.takeOutStock(order.itemName);
            // 預かり金から購入金額を差し引く
            if (CashManage_1.default.pay(StockManage_1.default.getPrice(order.itemName)) === 'free') {
                return "\u304A\u3081\u3067\u3068\u3046\u3054\u3056\u3044\u307E\u3059\uFF01" + order.itemName + "\u3092\u7121\u6599\u3067\u30D7\u30EC\u30BC\u30F3\u30C8\u3057\u307E\u3059\uFF01";
            }
            ;
            return order.itemName + "\u304C\u8CB7\u3048\u307E\u3057\u305F\u3002\u73FE\u5728\u306E\u9810\u304B\u308A\u91D1\u306F" + CashManage_1.default.getDeposit() + "\u5186\u3067\u3059";
        }
        catch (err) {
            return err + "\u73FE\u5728\u306E\u9810\u304B\u308A\u91D1\u306F" + CashManage_1.default.getDeposit() + "\u5186\u3067\u3059";
        }
    };
    // お釣りを払い出す
    VendingMachine.prototype.payoutChange = function () {
        return "\u6BCE\u5EA6\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3057\u305F\u3002\u304A\u91E3\u308A" + CashManage_1.default.payoutChange() + "\u5186\u3092\u8FD4\u91D1\u3057\u307E\u3059\u3002";
    };
    // 商品一覧を表示する
    VendingMachine.prototype.showItems = function () {
        // 商品リスト取得
        var showItemList = StockManage_1.default.getItems();
        // 既に預かり金が存在する場合、残金で購入できる商品リストに絞る
        if (CashManage_1.default.getDeposit() !== 0)
            showItemList = this.getCanBuyItems(showItemList);
        // 商品情報を文字列にして結合
        var text = '商品一覧です （商品名：投入金額）\n';
        text += showItemList.map(function (item) { return item.getName() + ": " + item.getPrice() + "\u5186"; }).join('\n');
        this.showDisplay(text, 'standby');
    };
    // 残金で購入できる商品一覧取得
    VendingMachine.prototype.getCanBuyItems = function (items) {
        return items.filter(function (item) { return item.getPrice() <= CashManage_1.default.getDeposit(); });
    };
    // 画面に表示する
    VendingMachine.prototype.showDisplay = function (text, type) {
        var wrapText = Wrap_1.default.wrapping(text, type);
        if (wrapText === null)
            return;
        console.log(wrapText);
    };
    // 残金で購入できるか判定する
    VendingMachine.prototype.isBuyableState = function () {
        var minPrice = StockManage_1.default.getMinPrise();
        return CashManage_1.default.isBuyableState(minPrice);
    };
    // コンソールに質問を表示し、回答を取得する
    VendingMachine.prototype.questionWithFormatCheck = function (questionText, format, formatChecker) {
        return __awaiter(this, void 0, void 0, function () {
            var result, self_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        _a.label = 1;
                    case 1:
                        if (!(result === null)) return [3 /*break*/, 3];
                        // 注文を入力する (null: 入力ミス)
                        this.showDisplay(questionText + " " + format);
                        self_1 = this;
                        return [4 /*yield*/, self_1.stdinWithFormatCheck(self_1, formatChecker)];
                    case 2:
                        result = _a.sent();
                        // 入力ミスチェック
                        if (result === null) {
                            this.showDisplay("\u5165\u529B\u30DF\u30B9\u304C\u3042\u308A\u307E\u3059\u3002\u4E0B\u8A18\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" + eol + format, 'standby');
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, result];
                }
            });
        });
    };
    // 標準入力を受け付け、フォーマットのチェックを行う
    VendingMachine.prototype.stdinWithFormatCheck = function (self, formatChecker) {
        return __awaiter(this, void 0, void 0, function () {
            var orderText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.default.stdin('■ 入力: ')];
                    case 1:
                        orderText = _a.sent();
                        if (!formatChecker(self, orderText))
                            return [2 /*return*/, null];
                        return [2 /*return*/, orderText];
                }
            });
        });
    };
    // 注文受付用フォーマットチェック
    VendingMachine.prototype.isMatchOrderFormat = function (self, text) {
        // 購入取りやめ
        if (text.toLowerCase() === 'n')
            return true;
        var elements = utils_1.default.decomposition(text, ':');
        if (elements.length != self.elementNum)
            return false;
        self.inputItemName = elements[0];
        self.inputPayment = Number(elements[1]);
        // Nanの場合（number形にキャストできない値だった場合）
        if (isNaN(self.inputPayment))
            return false;
        return true;
    };
    return VendingMachine;
}());
module.exports = new VendingMachine();
