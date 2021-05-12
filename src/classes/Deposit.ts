// お金管理装置
class Deposit {

    private deposit: number;

    constructor() {
        this.deposit = 0;
    }

    // 投入金額を格納
    public addDeposit(payment: number): boolean { //TODO:voidは返り値を気にしないということ。throwするならboolean返すべき
        if (payment < 0) throw `投入金額が不正です： ${payment}。`;
        this.deposit += payment;
        return true;
    };

    // 支払い実行
    public pay(price: number): boolean{
        const diff = this.deposit - price;
        if (diff < 0) throw `${Math.abs(diff)}円足りません。`;
        this.deposit -= price;
        return true;
    }

    // お釣りの払い出し
    public payout(): boolean {
        this.deposit = 0;
        return true;
    }

    // 残金取得
    public getDeposit(): number {
        return this.deposit;
    }
}

export = new Deposit();