import { VendingMachine } from './classes/VendingMachine';
import { Utils } from './public/libs/utils';

const vendingMachine = new VendingMachine();

const itemList = [
    { name: 'water', price: 100 },
    { name: 'tea', price: 130 },
    { name: 'cola', price: 150 },
];

const stockNum = 3;
const maxLoop = 10;

const main = async (): Promise<void> => {
    try {
        // 商品の製造、自動販売機に追加
        itemList.forEach(item => {
            vendingMachine.addStock(item.name, item.price, stockNum);
        });

        // 購入可能な商品一覧を表示
        vendingMachine.showBuyableItems();

        for (let count = 0; count <= maxLoop; count++) {
            // 注文入力
            const order: string = await Utils.stdin('■ 入力: ');

            if (order === 'n') break;

            // 購入
            vendingMachine.buy(order);

            // 追加購入可能か確認
            if (!vendingMachine.isBuyable()) break;

            // 購入可能な商品一覧を表示
            vendingMachine.showBuyableItems();
        }

        vendingMachine.payout();
    } catch (err) {
        process.stdout.write(String(err));
    }
};

main().finally(() => {});
