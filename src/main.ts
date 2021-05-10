
// const VendingMachine = require('./classes/VendingMachine');
// const {Item} = require('./classes/Item');
import {Item} from './classes/Item';
import VendingMachine from './classes/VendingMachine';

const itemList = [
    {'name': 'water', 'price': 100},
    {'name': 'tea', 'price': 130},
    {'name': 'cola', 'price': 150}
]

const main = async (): Promise<void> => {

    try {
        // 商品の製造、自動販売機に追加
        itemList.forEach((itemProperty) => {
            let item = new Item(itemProperty.name, itemProperty.price);
            VendingMachine.addStocker(item, 3);
        });

        let buyable: boolean = true; // 購入できる状態
        while(buyable) {

            // 注文
            const order: Order|null = await VendingMachine.order();

            // 購入
            buyable = await VendingMachine.buyFacade(order);
        }
    } catch(err) {
        console.log(err);
    }
}

main();
