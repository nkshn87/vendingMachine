import VendingMachine from './classes/VendingMachine';
import utils from './public/libs/utils'

const itemList = [
    {'name': 'water', 'price': 100},
    {'name': 'tea', 'price': 130},
    {'name': 'cola', 'price': 150}
]

const main = async (): Promise<void> => {

    try {
        // 商品の製造、自動販売機に追加
        itemList.forEach((item) => {
            VendingMachine.addStock(item.name, item.price, 3);
        });

        // 購入できる状態である限り、購入処理を繰り返す
        let buyable: boolean = true;
        while(buyable) {

            // 商品一覧を確認
            VendingMachine.showItems();

            // 注文入力
            const order: string = await utils.stdin('■ 入力: ');

            // 購入
            buyable = VendingMachine.buy(order);
        }
    } catch(err) {
        console.log(err);
    }
}

main();