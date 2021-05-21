export class Item {

    private name: string;

    private price: number;

    public constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }

    public getName(): string {
        return this.name;
    }

    public getPrice(): number {
        return this.price;
    }

    // setは許可しない
}
