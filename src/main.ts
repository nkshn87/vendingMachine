import VendingMachine from './classes/VendingMachine';
import {Utils} from './public/libs/utils';

const itemList = [
    {'name': 'water', 'price': 100},
    {'name': 'tea', 'price': 130},
    {'name': 'cola', 'price': 150},
];

const main = async(): Promise<void> => {
    try {
        const STOCK_NUM = 3;
        // 商品の製造、自動販売機に追加
        itemList.forEach((item) => {
            VendingMachine.addStock(item.name, item.price, STOCK_NUM);
        });

        // 購入できる状態である限り、購入処理を繰り返す
        let buyable = true;
        while(buyable) {
            // 商品一覧を確認
            VendingMachine.showItems();

            // 注文入力
            const order: string = await Utils.stdin('■ 入力: ');

            // 購入
            buyable = VendingMachine.buy(order);
        }
    } catch(err) {
        throw new ComomonError(err);
    }
};

main().catch(err => console.log(err));

// 基底エラークラス
class ComomonError extends Error {
    public constructor(...args: Array<string>) {
        super(...args);
        args.forEach((val: string) => {console.log(val);});
    }
}
