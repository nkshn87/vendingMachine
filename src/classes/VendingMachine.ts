import CreateOutputText = require('../classes/CreateOutputText');
import StockManage from './StockManage';
import Deposit from './Deposit';
import type {Item} from './Item';
import {Utils} from '../public/libs/utils';

// 自動販売機
class VendingMachine {
    private deposit: number;

    public constructor() {
        this.deposit = 0;
    }

    // 商品一覧を表示する
    public showItems(): void {
        // 在庫のある商品リスト取得
        let showItemList = StockManage.getItemsExistsStock();

        // 既に預かり金が存在する場合、残金で購入できる商品リストに絞る
        if (Deposit.getDeposit() !== 0) showItemList = showItemList.filter((item: Item) => item.getPrice() <= Deposit.getDeposit());

        // 商品情報を文字列にして結合
        let text = '商品一覧です （商品名：投入金額）\n';
        text += showItemList.map((item: Item) => `${item.getName()}: ${item.getPrice()}円`).join('\n');
        text += '\n\nご注文内容を入力してください。※ 購入を止める場合は「n」と入力', '商品名：投入金額(単位なし)';
        this.showDisplay(text);
    }

    // 購入処理
    public buy(order: string): boolean {
        if (order.toLowerCase() !== 'n') { // 購入取りやめではない場合
            // 注文情報取得
            const elements: Array<string> = Utils.decomposition(order, ':');

            const inputItemName = elements[0];

            const inputPayment = Number(elements[1]);

            const ORDER_ELEMENT_NUM = 2;

            // フォーマットチェック
            if (elements.length != ORDER_ELEMENT_NUM || isNaN(inputPayment)) {
                this.showDisplay('入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)');
                return true; // 購入処理は行わず終了（再度購入可能状態）
            }

            try{
                // 商品情報取得
                const item: Item = StockManage.getItem(inputItemName);

                // 料金投入
                Deposit.addDeposit(inputPayment);

                // バックアップ
                this.deposit = Deposit.getDeposit();

                // 1/10の確率で支払いなし
                const RAMDOM_MAX_NUM = 10;
                if (Utils.randomNumFloor(RAMDOM_MAX_NUM) === 0) {
                    CreateOutputText.addText(`おめでとうございます！${inputItemName}を無料でプレゼントします！`);
                } else {
                    // 残金から購入金額を差し引く
                    Deposit.pay(item.getPrice());
                }

                // 在庫をひとつ減らす
                StockManage.decrementStockMap(item);

                // 購入処理完了
                CreateOutputText.addText(`${inputItemName}が買えました。現在の預かり金は${Deposit.getDeposit()}円です。`);
            }catch(err){
                // 支払いキャンセル
                Deposit.addDeposit(this.deposit - Deposit.getDeposit()); // 支払済の場合は払い戻す
                CreateOutputText.addText(`${String(err)}現在の預かり金は${Deposit.getDeposit()}円です。`); //no-useless-catch
            }

            //  追加購入可能な状態か判定(最小金額が0は商品がひとつもない状態)
            if (StockManage.getMinPrise() !== 0 && Deposit.getDeposit() >= StockManage.getMinPrise()) return true;
        }

        // お釣りの払い出し
        this.showDisplay(`毎度ありがとうございました。お釣り${Deposit.getDeposit()}円を返金します。`);
        Deposit.payout();
        return false;
    }

    // 商品を補充する
    public addStock(name: string, price: number, stockNum: number): void {
        StockManage.addStock(name, price, stockNum);
    }

    // 画面に表示する
    private showDisplay(text: string): void {
        console.log(CreateOutputText.outputText(text));
    }
}

export =  new VendingMachine();
