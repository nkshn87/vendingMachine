import {Item} from './Item';

// 在庫管理
class StockManage {
    private itemMap:Map<string, Item>; // 商品名は一意
    private stockMap:Map<Item, number>;
    private minPrice: number;

    constructor() {
        this.itemMap = new Map();
        this.stockMap = new Map();
        this.minPrice = 0;
    }

    // 商品の在庫を指定数追加
    public addStock(name: string, price: number, stockNum: number): void { //TODO:最小金額

        // 入力値チェック
        if (!stockNum || stockNum <= 0) throw `${name}の追加在庫数の値が不正です。: ${stockNum}`;


        // 存在しなければ新規作成
        const item = this.itemMap.get(name);
        if (!item) {
            const inputItem = new Item(name, price);
            this.itemMap.set(inputItem.getName(), inputItem);
            this.stockMap.set(inputItem, stockNum);
            if (this.minPrice === 0 || this.minPrice > inputItem.getPrice()) this.minPrice = inputItem.getPrice();
        } else {
            // あれば在庫追加
            const stock = this.stockMap.get(item)
            if (stock === undefined) {
                this.stockMap.set(item, stockNum);
            } else {
                this.stockMap.set(item, stock + stockNum);
            }
        }
    }

    // 指定した商品を取得する
    public getItem(name: string): Item {
        const item = this.itemMap.get(name);
        if (item === undefined) throw `${name}の取り扱いはありません。`;
        return item;
    }

    // 商品を１つ取り出し
    public decrementStockMap(item: Item): void {
        const stock = this.stockMap.get(item);
        if (stock === undefined || stock === 0) throw `${item.getName()}は売り切れです。`;

        // 在庫ひとつ減らす
        this.stockMap.set(item, stock - 1);

        // 最小価格の更新
        if (stock === 1 && this.minPrice === item.getPrice()) {
            const prices: number[] = this.getItemsExistsStock().map(item => item.getPrice());
            if (prices.length === 0) {
                this.minPrice === 0;
                return;
            }
            this.minPrice = prices.reduce((price1, price2) => Math.min(price1, price2));
        }
    }

    // 在庫のある商品一覧を取得
    public getItemsExistsStock(): Item[] {
        let itemListToString: Item[] = [];
        let item: Item, stockNum: number;
        for ([item, stockNum] of this.stockMap.entries()) { // イテレータのためmap使えない
            if (stockNum !== 0 && item !== undefined) itemListToString.push(item);
        }
        return itemListToString;
    }

    // 商品の最小価格取得
    public getMinPrise(): number {
        return this.minPrice;
    }
}

export = new StockManage();