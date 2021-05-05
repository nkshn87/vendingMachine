// 標準出力用ライブラリ
const readline = require('readline-promise').default.createInterface({
    input: process.stdin, output: process.stdout, terminal: true
});

/**
 * 型指定
 */

// 商品種別
export const drinkTypes = {
    WATER: 'water',
    TEA: 'tea',
    COLA: 'cola'
 } as const;

// 注文フォーマット
export type Order = {
    itemName: string,
    payment: number
};

type isCanBuyAnother = boolean;


/**
 * クラス定義
 */

// 商品
export class Item {

    public name:string;
    public price:number;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }

    public getPropertyToString(): string {
        return `${this.name}: ${this.price}円`;
    }
}


// 自動販売機
export class VendingMachine {

    private operation = new Operation();
    private stocker = new Stocker();
    private casher = new Casher();


    public async order():Promise<Order> {

        // 商品一覧を表示する
        console.log('商品一覧です （商品名：投入金額）');
        console.log(this.casher.getItemListToString());

        // 正しい入力を受けるまでループ
        let order: Order | null = null;
        while (order == null) {
            // 注文を入力する (null: 入力ミス)
            console.log('ご注文内容を入力してください 商品名：投入金額（単位なし）');
            order = await this.operation.recieveOrder();

            // 入力ミスチェック
            if (order === null) {
            console.log('入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)');
            }
        }

        // 料金投入
        this.casher.addDeposit(order.payment); // TODO
        return order
    }


    public buy(order: Order): isCanBuyAnother {

        // 在庫確認
        if (this.stocker.isNotInStock(order.itemName)) {
            console.log(`${order.itemName}は売り切れです。${order.payment}円返金します。`);
            return false;
        }

        // 投入金額過不足確認
        const diffFromPrice = this.casher.getDifferenceFromPrice(order.itemName, order.payment);
        if (diffFromPrice < 0) {
            console.log(`${order.itemName}が買えません。${Math.abs(diffFromPrice)}円足りません。`);
            return false;
        }

        // 購入
        this.casher.pay(order.itemName);
        this.stocker.takeOutStock(order.itemName);
        console.log(`${order.itemName}が買えました。お釣りは${this.casher.getChange()}円です。`);
        return this.casher.isCanBuyAnother();
    }


    // 商品を補充する
    public addStocker(item: Item, stockNum: number):void {
        this.stocker.addStock(item.name, stockNum);
        this.casher.addPriceList(item);
    }
}


// 在庫管理装置
class Stocker {
    private stocks:Map<string, Stock> = new Map();

    // 在庫有無を確認
    public isNotInStock(itemName: string): boolean {
        const stock = this.stocks.get(itemName)
        if (stock == undefined) return true;
        return stock.isNotIn();
    }

    // 商品を指定数追加
    public addStock(itemName: string, stockNum: number): void {
        const stock = this.stocks.get(itemName);
        if (!stock) {
            this.stocks.set(itemName, new Stock(stockNum));
            return;
        }
        return stock.add(stockNum);
    }

    // 商品を１つ取り出し
    public takeOutStock(itemName: string): void {
        const stock = this.stocks.get(itemName);
        return stock?.takeOut();
    }
}


// お金管理装置
class Casher {

    private priceList:Item[];
    private deposit: number;

    constructor() {
        this.deposit = 0;
        this.priceList = [];
    }

    // 商品の料金を料金リストへ追加
    public addPriceList(item: Item): void { this.priceList.push(item); }

    // 投入金額を格納
    public addDeposit(payment: number): void { this.deposit += payment; }

    // 支払い実行
    public pay(itemName: string): void {
        this.priceList.forEach((item) => { if (item.name == itemName) this.deposit -= item.price;})
    }

    // お釣りの取得
    public getChange(): number { return this.deposit; }

    // 商品一覧を文字列で取得
    public getItemListToString():string {
        let itemListToString: string[] = []
        this.priceList.forEach((item) => itemListToString.push(item.getPropertyToString()));
        return itemListToString.join('\n');
    }

    // 商品の値段との過不足額取得
    public getDifferenceFromPrice(itemName: string, payment: number): number {
        let price: number = 0;
        this.priceList.forEach((item): void => { if (item.name == itemName) price =  item.price; });
        return payment - price; // 在庫確認の後に実行するため、必ずリストにマッチする
    }

    // 最小金額と残高と比較
    public isCanBuyAnother():boolean { return this.getMinPriceFromItems() < this.deposit; }

    // 全商品のうち最小の金額を取得
    private getMinPriceFromItems():number {
        let minPrice: number = 9999 // TODO
        this.priceList.forEach((item) => { if (item.price < minPrice)  minPrice = item.price; })
        return minPrice;
    }
}


// 在庫
class Stock {
    private quantity: number;

    constructor(quantity: number) { this.quantity = quantity; }

    // 在庫の有無を確認
    public isNotIn(): boolean { return this.quantity <= 0; }

    // 指定数追加
    public add(num: number): void { this.quantity += num; }

    // １つ取り出し
    public takeOut(): void { this.quantity -= 1; }
}


// 画面
class Operation {

    private orderReader = new OrderReader();

    // ラッピングしてコンソールへ表示する
    public showDisplayWithWrapping(): void {
        console.log()　// TODO
    }

    // 注文入力欄を表示し、注文を受けとる
    public async recieveOrder(): Promise<Order | null> {
        const orderText: string = await this.standardOutput();
        return this.orderReader.getElement(orderText);
    }

    // 標準入力
    private async standardOutput(): Promise<string> {
        let inputText: string = '';
        await readline.questionAsync('入力：').then((answer: string) => inputText = answer);
        // const inputText = readline.on('line', (inputText: string) => inputText);
        return inputText;
    }
}


// 注文読みとり機
class OrderReader {

    private elementNum: number; // 注文要素数
    private itemName: string;
    private payment: number;

    //  TODO 各要素の型のハードコーディング無くしたい
    constructor() {
        this.elementNum = 2;
        this.itemName = '';
        this.payment = 0;
    }

    public getElement(text: string): Order | null {

        // フォーマットチェック
        if (this.isNotMatchOrderFormat(text, ':')) return null;

        return { itemName: this.itemName, payment: this.payment }
    }

    private isNotMatchOrderFormat(text: string, format: string): boolean {
        const elements: string[] = this.decomposition(text, format);
        if (elements.length != this.elementNum) return true;

        this.itemName = elements[0];
        this.payment = Number(elements[1]);

        // Nanの場合（number形にキャストできない値だった場合）
        if (isNaN(this.payment)) return true;

        return false;
    }

    // TODO : utilsでいい
    private decomposition(text: string, format: string): string[] {
        return (String(text)).split(format);
    }
}