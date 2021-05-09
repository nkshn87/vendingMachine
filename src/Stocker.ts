// 在庫管理
class Stocker {
    private itemMap:Map<string, typeof Item> = new Map();
    private stockMap:Map<typeof Item, number> = new Map();

    // 商品を指定数追加
    public addStock(item: typeof Item, stockNum: number): void {
        if (!stockNum || stockNum <= 0) throw new Error(`${item.name}の追加在庫数の値が不正です。: ${stockNum}`);
        const stock = this.stockMap.get(item);

        if (!stock) {
            this.itemMap.set(item.name, item);
            this.stockMap.set(item, stockNum);
        } else {
            this.stockMap.set(item, stock + stockNum);
        }
    }

    // 商品を１つ取り出し
    public takeOutStock(itemName: string): void {
        const item = this.itemMap.get(itemName);
        const stock = this.stockMap.get(item);

        if (item == undefined) { // 取り扱いなし
            throw `${itemName}の取り扱いはありません。`
        }
        else if (stock == undefined || stock == 0) {　// 取り扱いなしまたは、在庫切れ
            throw `${item.name}は売り切れです。`;
        } else {
            this.stockMap.set(item, stock - 1);
        }
    }

    // 指定した商品の料金を取得
    public getPrice(itemName: string): number {
        return this.itemMap.get(itemName).price;
    }

    // 商品一覧を取得
    public getItems(): any[] {　//TODO:anyやめたい
        let itemListToString: any[] = []
        for (let item of this.itemMap.values()) { // イテレータのためmap使えない
            itemListToString.push(item);
        }
        return itemListToString;
    }

    // 最小価格の商品取得
    public getMinPrise(): number {
        const items = this.itemMap.values();
        let item = items.next();
        let minPrice = item.value.price;
        while (!item.done) {
            if (minPrice > item.value.price) minPrice = item.value.price;
            item = items.next();
        }
        return minPrice;
    }

}

export = new Stocker();