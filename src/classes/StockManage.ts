import { FormatError } from '../errors/FormatError';
import { Item } from './Item';

// 在庫管理
export class StockManage {
    private stockMap: Map<Item, number>;

    public constructor() {
        this.stockMap = new Map<Item, number>();
    }

    // 商品の在庫を指定数追加
    public addStock(name: string, price: number, stockNum: number): boolean {
        // 入力値チェック
        if (stockNum <= 0) {
            throw new FormatError(name + 'の追加在庫数の値が不正です。: ' + String(stockNum));
        }

        // 商品の取り扱い確認（過去にstockMapに追加されたことがあるか）
        const item = this.getItem(name);

        // 取り扱いがない場合、新規作成
        if (item === undefined) {
            const inputItem = new Item(name, price);
            this.stockMap.set(inputItem, stockNum);
            return true;
            // 既に取り扱いがある場合、在庫数を追加
        } else {
            const stock = this.stockMap.get(item);
            if (stock !== undefined) this.stockMap.set(item, stock + stockNum);
            // 取り扱い確認が完了しているため、stockがundefinedになることはない
            return true;
        }
    }

    // 指定した商品を取得する
    public getItem(name: string): Item | undefined {
        for (const item of this.stockMap.keys()) {
            if (item.getName() === name) return item;
        }
        return undefined;
    }

    // 商品を１つ取り出し
    public decrementStockMap(item: Item): boolean {
        const stock = this.stockMap.get(item);
        if (stock === undefined || stock === 0) throw new Error(item.getName() + 'は売り切れです。');

        // 在庫ひとつ減らす
        this.stockMap.set(item, stock - 1);

        return true;
    }

    // 在庫のある商品一覧を取得
    public getItemsInStock(): Array<Item> {
        return Array.from(this.stockMap).filter((args) => args[1] !== 0).map((args) => args[0]);

        const itemList: Array<Item> = []; //TODO:これいらない
        for (const [item, stockNum] of this.stockMap.entries()) {
            //TODO:１行で書ける
            if (stockNum !== 0) itemList.push(item);
        }
        return itemList;
    }

    // 商品の最小価格取得
    public getMinPrise(): number {
        //TODO:loopを減らす
        let minPrice: number | undefined; //TODO:なしでできる
        this.getItemsInStock().forEach((item: Item) => {
            if (minPrice === undefined || minPrice > item.getPrice()) minPrice = item.getPrice();
        });
        if (minPrice === undefined) return 0;
        return minPrice;
    }
}
