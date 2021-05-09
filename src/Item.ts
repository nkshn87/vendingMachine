export class Item {

    private name: string;
    private price: number; // TODO : 大文字小文字の違い

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }

    public getName() {
        return this.name;
    }

    public getPrice() {
        return this.price;
    }

    // setは許可しない
}