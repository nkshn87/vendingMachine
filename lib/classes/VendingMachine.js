"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendingMachine = void 0;
var CreateOutputText_1 = require("../classes/CreateOutputText");
var StockManage_1 = require("./StockManage");
var Deposit_1 = require("./Deposit");
var RamdomFreeCampaign_1 = require("./RamdomFreeCampaign");
var utils_1 = require("../public/libs/utils");
var NotFoundError_1 = __importDefault(require("../errors/NotFoundError"));
var UnexpectedError_1 = __importDefault(require("../errors/UnexpectedError"));
var FormatError_1 = require("../errors/FormatError");
// 自動販売機
var VendingMachine = /** @class */ (function () {
    // private campain: Campaign;
    function VendingMachine() {
        this.depositBuckup = 0;
        this.stockManage = new StockManage_1.StockManage();
        this.deposit = new Deposit_1.Deposit();
        // this.campain = new Campaign();
    }
    // 商品を補充する
    VendingMachine.prototype.addStock = function (name, price, stockNum) {
        this.stockManage.addStock(name, price, stockNum);
    };
    // 購入可能な商品一覧を表示する
    VendingMachine.prototype.showBuyableItems = function () {
        var buyableItems = this.getBuyableItems();
        this.showDisplay(this.createMenuOutputText(buyableItems));
    };
    VendingMachine.prototype.buy = function (orderText) {
        try {
            // 注文内容を読み取り
            var order = this.readOrderElement(orderText);
            // 商品を検索
            var item = this.searchItem(order.itemName);
            // 料金の投入
            this.deposit.addDeposit(order.deposit);
            // 割引の適用
            var payment = this.apllyDiscount(item.getPrice()); //TODO:campaignインスタンス化 変えたい時にかかる時間を考える
            // 取引処理
            this.trade(item, payment);
            // 購入結果の表示
            this.showDisplay(this.createBuyResultOutputText(item.getName(), this.deposit.showDeposit(), payment)); //TODO:
            return true;
        }
        catch (err) {
            if (err instanceof Error) {
                this.showDisplay(this.createBuyResultOutputText('dummy', this.deposit.showDeposit(), 0, err.message));
            }
            return false;
        }
    };
    VendingMachine.prototype.isBuyable = function () {
        //  追加購入可能な状態か判定(最小金額が0は商品がひとつもない状態)
        if (this.stockManage.getMinPrise() !== 0 && this.deposit.showDeposit() >= this.stockManage.getMinPrise()) {
            return true;
        }
        return false;
    };
    // お釣りの払い出し
    VendingMachine.prototype.payout = function () {
        this.showDisplay(this.createPayOutResultOutputText(this.deposit.showDeposit()));
        this.deposit.payout();
        return true;
    };
    // 購入可能な商品一覧を取得する
    VendingMachine.prototype.getBuyableItems = function () {
        var _this = this;
        // 在庫のある商品リスト取得
        var buyableItems = this.stockManage.getItemsInStock();
        // 既に預かり金が存在する場合、残金で購入できる商品リストに絞る
        if (this.deposit.showDeposit() !== 0) {
            buyableItems = buyableItems.filter(function (item) { return item.getPrice() <= _this.deposit.showDeposit(); });
        }
        return buyableItems;
    };
    // メニュー表を作成する
    VendingMachine.prototype.createMenuOutputText = function (items) {
        var createOutputText = new CreateOutputText_1.CreateOutputText();
        createOutputText.addText('商品一覧です （商品名：投入金額）');
        createOutputText.createLine();
        createOutputText.createLine();
        items.forEach(function (item) {
            createOutputText.addText(item.getName());
            createOutputText.addText(': ');
            createOutputText.addText(String(item.getPrice()));
            createOutputText.addText('円');
            createOutputText.createLine();
        });
        createOutputText.createLine();
        createOutputText.addText('ご注文内容を入力してください。※ 購入を止める場合は「n」と入力 商品名：投入金額(単位なし)');
        createOutputText.createLine();
        return createOutputText.outputText();
    };
    // 購入結果の出力テキストを作成する
    VendingMachine.prototype.createBuyResultOutputText = function (
    //TODO:
    itemName, deposit, payment, errorMessage) {
        var createOutputText = new CreateOutputText_1.CreateOutputText();
        // 購入結果
        if (errorMessage === undefined) {
            if (payment === 0) {
                createOutputText.addText('おめでとうございます！');
                createOutputText.addText(itemName);
                createOutputText.addText('をプレゼントします！');
            }
            else {
                createOutputText.addText(itemName);
                createOutputText.addText('が買えました。');
            }
        }
        else {
            createOutputText.addText(errorMessage);
        }
        createOutputText.addText('現在の預かり金は');
        createOutputText.addText(String(deposit));
        createOutputText.addText('円です。');
        createOutputText.createLine();
        // 生成したテキストを返却
        return createOutputText.outputText();
    };
    // 購入結果の出力テキストを作成する
    VendingMachine.prototype.createPayOutResultOutputText = function (deposit) {
        var createOutputText = new CreateOutputText_1.CreateOutputText();
        createOutputText.addText('毎度ありがとうございました。');
        createOutputText.addText('お釣り');
        createOutputText.addText(String(deposit));
        createOutputText.addText('円を返金します。');
        createOutputText.createLine();
        // 生成したテキストを返却
        return createOutputText.outputText();
    };
    // 画面に表示する
    VendingMachine.prototype.showDisplay = function (text) {
        process.stdout.write(text);
    };
    // 注文内容を読み取る
    VendingMachine.prototype.readOrderElement = function (orderText) {
        var elements = utils_1.Utils.decomposition(orderText, ':');
        // フォーマットチェック
        if (!this.checkFormatOrder(elements))
            throw new FormatError_1.OrderFormatError('入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)');
        return { itemName: elements[0], deposit: Number(elements[1]) };
    };
    // フォーマットチェック
    VendingMachine.prototype.checkFormatOrder = function (elements) {
        var elementsNum = 2;
        if (elements.length !== elementsNum || isNaN(Number(elements[1]))) {
            return false;
        }
        return true;
    };
    // 商品を検索する
    VendingMachine.prototype.searchItem = function (itemName) {
        var item = this.stockManage.getItem(itemName);
        if (item === undefined)
            throw new NotFoundError_1.default(itemName + 'の取り扱いはありません。');
        return item;
    };
    // 割引を適用する
    VendingMachine.prototype.apllyDiscount = function (itemPrice) {
        var campaign = new RamdomFreeCampaign_1.RamdomFreeCampaign();
        return campaign.discount(itemPrice);
    };
    // 商取引処理する
    VendingMachine.prototype.trade = function (item, payment) {
        this.depositBuckup = this.deposit.showDeposit();
        try {
            this.deposit.pay(payment);
            this.stockManage.decrementStockMap(item);
            return true;
        }
        catch (err) {
            // 支払済の場合返却する
            if (this.depositBuckup !== this.deposit.showDeposit()) {
                this.deposit.addDeposit(this.depositBuckup - this.deposit.showDeposit());
            }
            // エラーメッセージを返却
            if (err instanceof Error)
                throw new UnexpectedError_1.default(err.message);
            throw new UnexpectedError_1.default(String(err));
        }
    };
    return VendingMachine;
}());
exports.VendingMachine = VendingMachine;
