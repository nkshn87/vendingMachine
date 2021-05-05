const {VendingMachine, drinkTypes, Item, Order} = require('./classes');

// 注文フォーマット
type Order = {
    itemName: string,
    payment: number
}

const main = async (): Promise<void> => {

    // 自動販売機製造
    const vendingMachine = new VendingMachine();

    // 商品の製造
    const water = new Item(drinkTypes.WATER, 100);
    const tea = new Item(drinkTypes.TEA, 130);
    const cola = new Item(drinkTypes.COLA, 150);

    // 商品を自動販売機に追加
    vendingMachine.addStocker(water, 0);
    vendingMachine.addStocker(tea, 3);
    vendingMachine.addStocker(cola, 3);

    // 注文
    const order: Order = await vendingMachine.order();

    // 購入
    vendingMachine.buy(order);
}

main();