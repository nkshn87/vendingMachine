import { CreateOutputText } from '../classes/CreateOutputText';
import { StockManage } from './StockManage';
import { Deposit } from './Deposit';
import { RamdomFreeCampaign } from './RamdomFreeCampaign';
import type { Item } from './Item';
import { Utils } from '../public/libs/utils';
import ItemNotFoundError from '../errors/NotFoundError';
import UnexpectedBuyError from '../errors/UnexpectedError';
import { OrderFormatError } from '../errors/FormatError';
// import { Campaign } from './Campaign';

// 自動販売機
export class VendingMachine {
    private depositBuckup: number;
    private stockManage: StockManage;
    private deposit: Deposit;
    // private campain: Campaign;

    public constructor() {
        this.depositBuckup = 0;
        this.stockManage = new StockManage();
        this.deposit = new Deposit();
        // this.campain = new Campaign();
    }

    // 商品を補充する
    public addStock(name: string, price: number, stockNum: number): void {
        this.stockManage.addStock(name, price, stockNum);
    }

    // 購入可能な商品一覧を表示する
    public showBuyableItems(): void {
        const buyableItems = this.getBuyableItems();
        this.showDisplay(this.createMenuOutputText(buyableItems));
    }

    public buy(orderText: string): boolean {
        try {
            // 注文内容を読み取り
            const order = this.readOrderElement(orderText);

            // 商品を検索
            const item = this.searchItem(order.itemName);

            // 料金の投入
            this.deposit.addDeposit(order.deposit);

            // 割引の適用
            const payment = this.apllyDiscount(item.getPrice()); //TODO:campaignインスタンス化 変えたい時にかかる時間を考える

            // 取引処理
            this.trade(item, payment);

            // 購入結果の表示
            this.showDisplay(this.createBuyResultOutputText(item.getName(), this.deposit.showDeposit(), payment)); //TODO:
            return true;
        } catch (err) {
            if (err instanceof Error) {
                this.showDisplay(this.createBuyResultOutputText('dummy', this.deposit.showDeposit(), 0, err.message));
            }
            return false;
        }
    }

    public isBuyable(): boolean {
        //  追加購入可能な状態か判定(最小金額が0は商品がひとつもない状態)
        if (this.stockManage.getMinPrise() !== 0 && this.deposit.showDeposit() >= this.stockManage.getMinPrise()) {
            return true;
        }
        return false;
    }

    // お釣りの払い出し
    public payout(): boolean {
        this.showDisplay(this.createPayOutResultOutputText(this.deposit.showDeposit()));
        this.deposit.payout();
        return true;
    }

    // 購入可能な商品一覧を取得する
    private getBuyableItems(): Array<Item> {
        // 在庫のある商品リスト取得
        let buyableItems: Array<Item> = this.stockManage.getItemsInStock();

        // 既に預かり金が存在する場合、残金で購入できる商品リストに絞る
        if (this.deposit.showDeposit() !== 0) {
            buyableItems = buyableItems.filter((item: Item) => item.getPrice() <= this.deposit.showDeposit());
        }

        return buyableItems;
    }

    // メニュー表を作成する
    private createMenuOutputText(items: Array<Item>): string {
        const createOutputText = new CreateOutputText();
        createOutputText.addText('商品一覧です （商品名：投入金額）');
        createOutputText.createLine();
        createOutputText.createLine();
        items.forEach(item => {
            createOutputText.addText(item.getName());
            createOutputText.addText(': ');
            createOutputText.addText(String(item.getPrice()));
            createOutputText.addText('円');
            createOutputText.createLine();
        });

        createOutputText.createLine();
        createOutputText.addText(
            'ご注文内容を入力してください。※ 購入を止める場合は「n」と入力 商品名：投入金額(単位なし)'
        );
        createOutputText.createLine();
        return createOutputText.outputText();
    }

    // 購入結果の出力テキストを作成する
    private createBuyResultOutputText(
        //TODO:
        itemName: string,
        deposit: number,
        payment?: number,
        errorMessage?: string
    ): string {
        const createOutputText = new CreateOutputText();

        // 購入結果
        if (errorMessage === undefined) {
            if (payment === 0) {
                createOutputText.addText('おめでとうございます！');
                createOutputText.addText(itemName);
                createOutputText.addText('をプレゼントします！');
            } else {
                createOutputText.addText(itemName);
                createOutputText.addText('が買えました。');
            }
        } else {
            createOutputText.addText(errorMessage);
        }

        createOutputText.addText('現在の預かり金は');
        createOutputText.addText(String(deposit));
        createOutputText.addText('円です。');

        createOutputText.createLine();

        // 生成したテキストを返却
        return createOutputText.outputText();
    }

    // 購入結果の出力テキストを作成する
    private createPayOutResultOutputText(deposit: number): string {
        const createOutputText = new CreateOutputText();

        createOutputText.addText('毎度ありがとうございました。');
        createOutputText.addText('お釣り');
        createOutputText.addText(String(deposit));
        createOutputText.addText('円を返金します。');
        createOutputText.createLine();
        // 生成したテキストを返却
        return createOutputText.outputText();
    }

    // 画面に表示する
    private showDisplay(text: string): void {
        process.stdout.write(text);
    }

    // 注文内容を読み取る
    private readOrderElement(orderText: string): { itemName: string; deposit: number } {
        const elements: Array<string> = Utils.decomposition(orderText, ':');

        // フォーマットチェック
        if (!this.checkFormatOrder(elements))
            throw new OrderFormatError(
                '入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)'
            );

        return { itemName: elements[0], deposit: Number(elements[1]) };
    }

    // フォーマットチェック
    private checkFormatOrder(elements: Array<string>): boolean {
        const elementsNum = 2;
        if (elements.length !== elementsNum || isNaN(Number(elements[1]))) {
            return false;
        }
        return true;
    }

    // 商品を検索する
    private searchItem(itemName: string): Item {
        const item = this.stockManage.getItem(itemName);
        if (item === undefined) throw new ItemNotFoundError(itemName + 'の取り扱いはありません。');
        return item;
    }

    // 割引を適用する
    private apllyDiscount(itemPrice: number): number {
        const campaign = new RamdomFreeCampaign();
        return campaign.discount(itemPrice);
    }

    // 商取引処理する
    private trade(item: Item, payment: number): boolean {
        this.depositBuckup = this.deposit.showDeposit();
        try {
            this.deposit.pay(payment);
            this.stockManage.decrementStockMap(item);
            return true;
        } catch (err) {
            // 支払済の場合返却する
            if (this.depositBuckup !== this.deposit.showDeposit()) {
                this.deposit.addDeposit(this.depositBuckup - this.deposit.showDeposit());
            }

            // エラーメッセージを返却
            if (err instanceof Error) throw new UnexpectedBuyError(err.message);
            throw new UnexpectedBuyError(String(err));
        }
    }
}
