// const Wrap = require('./Wrap');
// const Stocker = require('./Stocker');
// const Casher = require('./Casher');
// const utils = require('../public/libs/utils');

import Wrap from './Wrap';
import StockManage from './StockManage';
import CashManage from './CashManage';
import {Item} from './Item';
import utils from '../public/libs/utils';
const eol = require('os').EOL; //改行コード

// import readline from 'readline-promise';
// import eol from 'os';


// TODO : calss private public リンター厳しいのいれる リストアップ

// 自動販売機
class VendingMachine {

    private elementNum: number;
    private inputItemName: string;
    private inputPayment: number;

    constructor() {
        this.elementNum = 2;　// 注文に必要な要素数
        this.inputItemName = '';
        this.inputPayment = 0;
    }

    // 注文を受ける
    public async order(): Promise<Order|null> { //TODO:asyncと戻り値の書き方もっかいテスト
        this.showItems();
        const reaction = await this.questionWithFormatCheck('ご注文内容を入力してください。※ 購入を止める場合は「n」と入力', '商品名：投入金額(単位なし)', this.isMatchOrderFormat);
        if (reaction === 'n') return null;
        const order = {itemName: this.inputItemName, payment: this.inputPayment};
        CashManage.addDeposit(order.payment); // 料金投入
        return order;
    }

    // 購入処理
    public async buyFacade(order: Order | null): Promise<boolean> {

        if (order !== null) {
            // 購入
            this.showDisplay(this.buy(order), 'standby');

            //  追加購入可能な状態か判定
            if (this.isBuyableState()) return true;
        }
        // お釣りの払い出し
        this.showDisplay(this.payoutChange());
        return false;
    }

    // 商品を補充する
    public addStocker(item: Item, stockNum: number): void {
        try{
            StockManage.addStock(item, stockNum);
        } catch(err) {
            throw err;
        }
    }

    /**
     * purivate method
     */

    // 購入
    private buy(order: Order): string {
        try{
            // 在庫をひとつ減らす
            StockManage.takeOutStock(order.itemName);

            // 預かり金から購入金額を差し引く
            if (CashManage.pay(StockManage.getPrice(order.itemName)) === 'free') {
                return `おめでとうございます！${order.itemName}を無料でプレゼントします！`;
            };
            return `${order.itemName}が買えました。現在の預かり金は${CashManage.getDeposit()}円です`;
        }catch(err){
            return `${err}現在の預かり金は${CashManage.getDeposit()}円です`;
        }
    }

    // お釣りを払い出す
    private payoutChange() {
        return `毎度ありがとうございました。お釣り${CashManage.payoutChange()}円を返金します。`;
    }

    // 商品一覧を表示する
    private showItems(): void { //TODO:オーバーロード検討
        // 商品リスト取得
        let showItemList = StockManage.getItems();

        // 既に預かり金が存在する場合、残金で購入できる商品リストに絞る
        if (CashManage.getDeposit() !== 0) showItemList = this.getCanBuyItems(showItemList);

        // 商品情報を文字列にして結合
        let text = '商品一覧です （商品名：投入金額）\n';
        text += showItemList.map((item: Item) => `${item.getName()}: ${item.getPrice()}円`).join('\n');
        this.showDisplay(text, 'standby');
    }

    // 残金で購入できる商品一覧取得
    private getCanBuyItems(items: Item[]): Item[] {
        return items.filter((item: Item) => item.getPrice() <= CashManage.getDeposit());
    }

    // 画面に表示する
    private showDisplay(text: string, type?: 'standby'): void {
        const wrapText = Wrap.wrapping(text, type);
        if (wrapText === null) return;
        console.log(wrapText);
    }

    // 残金で購入できるか判定する
    private isBuyableState(): boolean { //TODO:買いたいときにyes書きたくない
        const minPrice = StockManage.getMinPrise();
        return CashManage.isBuyableState(minPrice);
    }

    // コンソールに質問を表示し、回答を取得する
    private async questionWithFormatCheck(questionText: string, format: string, formatChecker: (self: this, text: string) => boolean): Promise<string> {
        // 正しい入力を受けるまでループ
        let result: string | null = null;
        while (result === null) {

            // 注文を入力する (null: 入力ミス)
            this.showDisplay(`${questionText} ${format}`);
            let self = this; // callback関数ではthisがwindowを挿してしまうため
            result = await self.stdinWithFormatCheck(self, formatChecker);

            // 入力ミスチェック
            if (result === null) {
                this.showDisplay(`入力ミスがあります。下記フォーマットで入力してください。${eol}${format}`, 'standby');
            }
        }
        return result;
    }

    // 標準入力を受け付け、フォーマットのチェックを行う
    private async stdinWithFormatCheck(self: this, formatChecker: (self: this, text: string) => boolean): Promise<string | null> {
        const orderText: string = await utils.stdin('■ 入力: ');
        if (!formatChecker(self, orderText)) return null;
        return orderText;
    }

    // 注文受付用フォーマットチェック
    private isMatchOrderFormat(self: this, text: string): boolean {
        // 購入取りやめ
        if (text.toLowerCase() === 'n') return true;

        const elements: string[] = utils.decomposition(text, ':');
        if (elements.length != self.elementNum) return false;

        self.inputItemName = elements[0];
        self.inputPayment = Number(elements[1]);

        // Nanの場合（number形にキャストできない値だった場合）
        if (isNaN(self.inputPayment)) return false;

        return true;
    }
}

export =  new VendingMachine();