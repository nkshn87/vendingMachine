"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CreateOutputText = require("../classes/CreateOutputText");
var StockManage_1 = __importDefault(require("./StockManage"));
var Deposit_1 = __importDefault(require("./Deposit"));
var utils_1 = require("../public/libs/utils");
// 自動販売機
var VendingMachine = /** @class */ (function () {
    function VendingMachine() {
        this.deposit = 0;
    }
    // 商品一覧を表示する
    VendingMachine.prototype.showItems = function () {
        // 在庫のある商品リスト取得
        var showItemList = StockManage_1.default.getItemsExistsStock();
        // 既に預かり金が存在する場合、残金で購入できる商品リストに絞る
        if (Deposit_1.default.getDeposit() !== 0)
            showItemList = showItemList.filter(function (item) { return item.getPrice() <= Deposit_1.default.getDeposit(); });
        // 商品情報を文字列にして結合
        var text = '商品一覧です （商品名：投入金額）\n';
        text += showItemList.map(function (item) { return item.getName() + ": " + item.getPrice() + "\u5186"; }).join('\n');
        text += '\n\nご注文内容を入力してください。※ 購入を止める場合は「n」と入力', '商品名：投入金額(単位なし)';
        this.showDisplay(text);
    };
    // 購入処理
    VendingMachine.prototype.buy = function (order) {
        if (order.toLowerCase() !== 'n') { // 購入取りやめではない場合
            // 注文情報取得
            var elements = utils_1.Utils.decomposition(order, ':');
            var inputItemName = elements[0];
            var inputPayment = Number(elements[1]);
            var ORDER_ELEMENT_NUM = 2;
            // フォーマットチェック
            if (elements.length != ORDER_ELEMENT_NUM || isNaN(inputPayment)) {
                this.showDisplay('入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)');
                return true; // 購入処理は行わず終了（再度購入可能状態）
            }
            try {
                // 商品情報取得
                var item = StockManage_1.default.getItem(inputItemName);
                // 料金投入
                Deposit_1.default.addDeposit(inputPayment);
                // バックアップ
                this.deposit = Deposit_1.default.getDeposit();
                // 1/10の確率で支払いなし
                var RAMDOM_MAX_NUM = 10;
                if (utils_1.Utils.randomNumFloor(RAMDOM_MAX_NUM) === 0) {
                    CreateOutputText.addText("\u304A\u3081\u3067\u3068\u3046\u3054\u3056\u3044\u307E\u3059\uFF01" + inputItemName + "\u3092\u7121\u6599\u3067\u30D7\u30EC\u30BC\u30F3\u30C8\u3057\u307E\u3059\uFF01");
                }
                else {
                    // 残金から購入金額を差し引く
                    Deposit_1.default.pay(item.getPrice());
                }
                // 在庫をひとつ減らす
                StockManage_1.default.decrementStockMap(item);
                // 購入処理完了
                CreateOutputText.addText(inputItemName + "\u304C\u8CB7\u3048\u307E\u3057\u305F\u3002\u73FE\u5728\u306E\u9810\u304B\u308A\u91D1\u306F" + Deposit_1.default.getDeposit() + "\u5186\u3067\u3059\u3002");
            }
            catch (err) {
                // 支払いキャンセル
                Deposit_1.default.addDeposit(this.deposit - Deposit_1.default.getDeposit()); // 支払済の場合は払い戻す
                CreateOutputText.addText(String(err) + "\u73FE\u5728\u306E\u9810\u304B\u308A\u91D1\u306F" + Deposit_1.default.getDeposit() + "\u5186\u3067\u3059\u3002"); //no-useless-catch
            }
            //  追加購入可能な状態か判定(最小金額が0は商品がひとつもない状態)
            if (StockManage_1.default.getMinPrise() !== 0 && Deposit_1.default.getDeposit() >= StockManage_1.default.getMinPrise())
                return true;
        }
        // お釣りの払い出し
        this.showDisplay("\u6BCE\u5EA6\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3057\u305F\u3002\u304A\u91E3\u308A" + Deposit_1.default.getDeposit() + "\u5186\u3092\u8FD4\u91D1\u3057\u307E\u3059\u3002");
        Deposit_1.default.payout();
        return false;
    };
    // 商品を補充する
    VendingMachine.prototype.addStock = function (name, price, stockNum) {
        StockManage_1.default.addStock(name, price, stockNum);
    };
    // 画面に表示する
    VendingMachine.prototype.showDisplay = function (text) {
        console.log(CreateOutputText.outputText(text));
    };
    return VendingMachine;
}());
module.exports = new VendingMachine();
