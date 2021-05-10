import {Item} from './Item';

// 在庫管理
class StockManage {
    private itemMap:Map<string, Item>;
    private stockMap:Map<string, number>;

    constructor() {
        this.itemMap = new Map();
        this.stockMap = new Map();
    }

    // 商品の在庫を指定数追加
    public addStock(item: Item, stockNum: number): void {

        // 入力値チェック
        if (!stockNum || stockNum <= 0) throw `${item.getName()}の追加在庫数の値が不正です。: ${stockNum}`;

        // 存在しなければ新規作成
        const stock = this.stockMap.get(item.getName());
        if (!stock) {
            this.itemMap.set(item.getName(), item);
            this.stockMap.set(item.getName(), stockNum);
        } else {
            // あれば在庫追加
            this.stockMap.set(item.getName(), stock + stockNum);
        }
    }

    // 商品を１つ取り出し
    public takeOutStock(itemName: string): void {
        const item = this.itemMap.get(itemName);
        if (item === undefined) throw `${itemName}の取り扱いはありません。`; // 取り扱いなし

        const stock = this.stockMap.get(item.getName());
        if (stock === undefined || stock === 0) throw `${item.getName()}は売り切れです。`;　// 在庫切れ

        this.stockMap.set(item.getName(), stock - 1);
    }

    // 指定した商品の料金を取得
    public getPrice(itemName: string): number {
        return this.itemMap.get(itemName)?.getPrice() || 0;
    }

    // 在庫のある商品一覧を取得
    public getItems(): Item[] {
        let itemListToString: Item[] = [];
        let itemName: string, stockNum: number;
        for ([itemName, stockNum] of this.stockMap.entries()) { // イテレータのためmap使えない
            const item = this.itemMap.get(itemName);
            if (stockNum !== 0 && item !== undefined) itemListToString.push(item);
        }
        return itemListToString;
    }

    // 最小価格の商品取得
    public getMinPrise(): number {
        const items = this.itemMap.values();
        let item = items.next();
        let minPrice = item.value.price;
        while (!item.done) {
            if (minPrice > item.value.getPrice()) minPrice = item.value.getPrice();
            item = items.next();
        }
        return minPrice;
    }

}

export = new StockManage();