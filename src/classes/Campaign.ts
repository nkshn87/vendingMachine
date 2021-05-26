export abstract class Campaign {
    public constructor() {}

    // 割引処理
    abstract discount(itemPrice: number): number;
}
