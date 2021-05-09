const OperationDisplay = require('./OperationDisplay');
const Stocker = require('./Stocker');
const Casher = require('./Casher');

// TODO : calss private public リンター厳しいのいれる リストアップ


// 自動販売機
class VendingMachine {

    constructor() {
    }

    // 商品一覧を表示する
    public showItemList(): void {
        // 商品リスト取得
        let showItemList = Stocker.getItems();

        // 既に預かり金が存在する場合、残金で購入できる商品リストに絞る
        if (Casher.getDeposit() !== 0) showItemList = this.getCanBuyItems(showItemList);

        // 商品情報を文字列にして結合
        let text = '商品一覧です （商品名：投入金額）\n';
        text += showItemList.map((item: typeof Item) => `${item.name}: ${item.price}円`).join('\n');
        OperationDisplay.showDisplayWithWrapping(text, 'start');
    }

    // 残金で購入できる商品一覧取得
    private getCanBuyItems(items: any[]): any[] {　//TODO:anyやめたい
        return items.filter((item: typeof Item) => item.price <= Casher.getDeposit());
    }

    // 注文を受ける
    public async recieveOrder(): Promise<Order> { //TODO:asyncと戻り値の書き方もっかいテスト
        await OperationDisplay.questionWithFormatCheck('ご注文内容を入力してください', '商品名：投入金額(単位なし)', OperationDisplay.isNotMatchOrderFormat);
        const order = OperationDisplay.getOrder();
        Casher.addDeposit(order.payment); // 料金投入
        return order;
    }

    // 購入
    public buy(order: Order): string {
        try{
            // 在庫をひとつ減らす
            Stocker.takeOutStock(order.itemName);

            // 預かり金から購入金額を差し引く
            if (Casher.pay(Stocker.getPrice(order.itemName)) === 'free') {
                return `おめでとうございます！${order.itemName}を無料でプレゼントします！`;
            };
            return `${order.itemName}が買えました。現在の預かり金は${Casher.getDeposit()}円です`;
        }catch(err){
            throw `${err}${Casher.payoutChange()}円返金します。`;
        }
    }

    // 結果の表示
    public showDisplayWithWrapping(text: string, type?: 'start' | 'middle' | 'end'): void {
        OperationDisplay.showDisplayWithWrapping(text, type);
    }

    // 商品を補充する
    public addStocker(item: typeof Item, stockNum: number):void {
        try{
            Stocker.addStock(item, stockNum);
        } catch(err) {
            throw err.message;
        }
    }

    // 残金で購入できるか判定する
    public checkCanBuyAnother() {
        const minPrice = Stocker.getMinPrise();
        return Casher.checkCanBuyAnother(minPrice);
    }

    // 追加購入するかユーザーに確認する
    public async quetionBuyAnother(): Promise<boolean | null> {
        let reaction = await OperationDisplay.questionWithFormatCheck('残金で追加購入可能な商品があります。購入しますか？', '[y/n]', OperationDisplay.isNotMatchYesNoFormat);
        reaction = reaction.toLowerCase();
        if (reaction === 'y') return true;
        return false;
    }

    // お釣りを払い出す
    public payoutChange() {
        return `毎度ありがとうございました。お釣り${Casher.payoutChange()}円を返金します。`;
    }
}

export =  new VendingMachine();