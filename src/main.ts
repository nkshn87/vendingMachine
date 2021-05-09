
const VendingMachine = require('./VendingMachine');
const {Item} = require('./Item');

// 注文フォーマット
type Order = {
    itemName: string,
    payment: number
}

const itemList = [
    {'name': 'water', 'price': 100},
    {'name': 'tea', 'price': 130},
    {'name': 'cola', 'price': 150}
]

const main = async (): Promise<void> => {

    try {
        // 商品の製造、自動販売機に追加
        itemList.forEach((itemProperty) => {
            let item = new Item(itemProperty.name, itemProperty.price)
            VendingMachine.addStocker(item, 3);
        });

        let canBuyAnother: boolean = true;
        while(canBuyAnother) {

            // 商品一覧表示
            VendingMachine.showItemList();

            // 注文
            const order: Order = await VendingMachine.recieveOrder();

            // 購入
            VendingMachine.showDisplayWithWrapping(VendingMachine.buy(order), 'start');

            //  追加購入可能な状態か判定
            if (VendingMachine.checkCanBuyAnother()) {
                // 追加購入するか確認
                if (await VendingMachine.quetionBuyAnother()) continue;
            }

            // お釣りの払い出し
            VendingMachine.showDisplayWithWrapping(VendingMachine.payoutChange());
            canBuyAnother = false;
        }
    } catch(err) {
        VendingMachine.showDisplayWithWrapping(err);
    }
}

main();
