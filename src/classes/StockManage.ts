import {Item} from './Item';

// 在庫管理
class StockManage {
    private itemMap: Map<string, Item>;

    private stockMap: Map<Item, number>;

    private minPrice: number;

    public constructor() {
        this.itemMap = new Map<string, Item>();
        this.stockMap = new Map<Item, number>();
        this.minPrice = 0;
    }

    // 商品の在庫を指定数追加 TODO:最小金額
    public addStock(name: string, price: number, stockNum: number): void {
        // 入力値チェック
        if (!stockNum || stockNum <= 0) {
            throw `${name}の追加在庫数の値が不正です。: ${stockNum}`;
        }

        // 存在しなければ新規作成
        const item = this.itemMap.get(name);
        if (item == null) {
            const inputItem = new Item(name, price);
            this.itemMap.set(inputItem.getName(), inputItem);
            this.stockMap.set(inputItem, stockNum);
            if (this.minPrice === 0 || this.minPrice > inputItem.getPrice()) {
                this.minPrice = inputItem.getPrice();
            }
        }
        // 存在する場合在庫追加
        const stock = this.stockMap.get(item!);
        this.stockMap.set(item!, stock! + stockNum);
    }

    // 指定した商品を取得する
    public getItem(name: string): Item {
        const item = this.itemMap.get(name);
        if (item == null) throw `${name}の取り扱いはありません。`;
        return item;
    }

    // 商品を１つ取り出し
    public decrementStockMap(item: Item): void {
        const stock = this.stockMap.get(item);
        if (!stock || stock === 0) throw `${item.getName()}は売り切れです。`;

        // 在庫ひとつ減らす
        this.stockMap.set(item, stock - 1);

        // 最小価格の更新
        if (stock === 1 && this.minPrice === item.getPrice()) {
            const prices = this.getItemsExistsStock().map(item => item.getPrice());
            if (prices.length === 0) {
                this.minPrice === 0; // 在庫が空なら最小価格は０円
                return;
            }
            this.minPrice = prices.reduce((price1, price2) => Math.min(price1, price2));
        }
    }

    // 在庫のある商品一覧を取得
    public getItemsExistsStock(): Array<Item> {
        const itemListToString: Array<Item> = [];
        for (const [item, stockNum] of this.stockMap.entries()) {
            if (stockNum !== 0) itemListToString.push(item);
        }
        return itemListToString;
    }

    // 商品の最小価格取得
    public getMinPrise(): number {
        return this.minPrice;
    }

    public getStock(item: Item): number {
        return this.stockMap.get(item) || 0;
    }
}

export = new StockManage();
